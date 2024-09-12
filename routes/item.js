import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// [심화] 라우터마다 prisma 클라이언트를 생성하고 있다. 더 좋은 방법이 있지 않을까?
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

// [필수] 1. 아이템 생성
// 1. 아이템 코드, 아이템 명, 아이템 능력, 아이템 가격을 req(request)에서 json으로 전달받기
// 2. 데이터베이스에 아이템 저장하기
router.post('/item/create/:itemId', async (req, res) => {
  try {
    // 클라이언트가 보낸 요청의 본문에서 아이템의 정보를 추출한다. JSON형식이여야됨
    const itemCode = req.body.item_code;
    const itemName = req.body.item_name;
    const atk = req.body.atk;
    const price = req.body.price;
  
    // creat메서드를 통해 db에 비동기적으로 아이템 생성
    const createItem = await prisma.item.create({
      //db에 저장할 속성값
      data: {
        itemCode: itemCode,
        itemName: itemName,
        atk: atk,
        price: price,
      },
    });
  
    res.status(200).json({ item_info: createItem})
    console.log(createItem)
  } catch(error) { //에러가 생겼을시
    //error: error라고 입력시 에러 원인이 나오는데 클라이언트에게 굳이 알려 줄 필요가 없다
    res.status(500).json({ error: '아이템 입력에 실패했습니다'});
    console.log(error); 
  }
});

// [필수] 2. 아이템 목록 조회
// findmany()는 배열 형태로 결과를 반환하는 메소드
router.get('/item/list', async (req, res) => {
  try {
    const itemList = await prisma.item.findMany();

    res.status(200).json({ items });
    console.log(itemList)
  } catch (error) {
    res.status(500).json({ error: '아이템 목록 조회에 실패했습니다' });
    console.log(error);
  }
});

// [필수] 3. 특정 아이템 조회
// 아이템 코드는 URL의 parameter로 전달받기
router.get('/item/:itemCode', async (req, res) => {
  try {
  // parseInt() 메소드는 문자열을 정수로 변환하는 함수이다.
  // url 파라미터에서 아이템코드를 가져온다는 뜻
  const itemCode = parseInt(req.params.itemCode); 

    // 찾았습니다
    // findItem메소드를 사용하여 db에서 itemCode와 일치하는 아이템을 비동기적으로 검색
    const findItem = await prisma.item.findUnique({ where: { itemCode: itemCode } })
    if (findItem == null) { // DB에 존재하지않는 경우
      res.status(404).json({ error: '아이템이 존재하지않습니다'}); // JSON형삭으로 클라이언트에게 알림
      return; // 함수종료
    }

    // 보냅니다
    res.status(200).json({ item_info: findItem});
    console.log(itemCode)
  } catch {error} { //try안에서도 예외가 발생한다면 error 처리
    res.status(500).json({error: '아이템 조회에 실패했습니다' });
    console.log(error);
  }
});

// [필수] 4. 특정 아이템 수정
// 아이템 코드는 URL의 parameter로 전달 받기
// 수정할 아이템 명, 아이템 능력을 req(request)에서 json으로 전달받기
router.post('/item/update', async (req, res) => {
  try{
  const itemCode = parseInt(req.params.itemCode);
  
  // 수정할 아이템 정보 가져오기
  const { itemName, atk, price } = req.body;

  // update메서드를 통해 아이템을 업데이트 한다.
  const updatedItem = await prisma.item.update({ where: {itemCode },
    
    date: {
      itemName: itemName,
      atk: atk,
      price: price,
    },
  });
        // 보냅니다
    res.status(200).json({ item_info: updatedItem});
    console.log(updatedItem)
  } catch {error} { // try안에서도 예외가 발생한다면 error 처리
    res.status(500).json({error: '아이템 조회에 실패했습니다' });
    console.log(error);
  }
});

export default router;
