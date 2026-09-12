import express from "express"
import { addproduct, deleteProductById, getproductBYId, getproducts, updateProductById } from '../Controllers/Product.js';

const router = express.Router();



///   ADD product
router.post('/add', addproduct)

// TO ALL PRODUCTS SHOW
// GET PRODUCTS
router.get('/all', getproducts)


// GET PRODUCT BY ID

router .get('/:id',getproductBYId)


// UPDATE PRODUCT BY ID

router.put('/:id', updateProductById);

// DELETE PRODUCTS
    router.delete('/:id', deleteProductById);

export default router

//6a4247e15f21cd2918e86527 6a422f8e39e753630c7d50af  6a422f8e39e753630c7d50af 6a44cf349119ef13ecc55ae5 6a4238317dac2b5e55833930
//6a8eac5861175c64eae1cb29,6a8eab8a61175c64eae1cb16  6a732e64b75384845e911b42 ,6a5d089f000102eab4cfd82e
//6a422b7ff39da81f092b7878 6a5d0895000102eab4cfd82d 6a5ca5ddad02b5a9767ca47a 6a57c4852ee1cf7b8217e58c
//6a52ad2fe4c9018f60504de2 ,6a57c4852ee1cf7b8217e58c 6a52aca28d15745f32511ac0 6a4ffc7e79a56856461a8bc8
//6a4ffb2179a56856461a8bc7 ,6a4ffa6d79a56856461a8bc6 6a424041d9136bd025fb830e,6a422f03f39da81f092b7879