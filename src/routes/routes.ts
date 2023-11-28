import { Router } from 'express';
import { GetPoolHandler,UserInfoHandler,GetGeneralInfoHandler} from '../controllers/controllers';

const router = Router();
router.get('/pool/:poolId',GetPoolHandler);
router.get ('/info',GetGeneralInfoHandler)
router.get('/user/:walletAddress',UserInfoHandler);
export default router;