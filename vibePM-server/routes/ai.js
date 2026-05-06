import { Router } from 'express'
import {
  generateImage,
  getQuotaStatus,
  matchImageToCard,
  generateDeepArticle,
  generateQuickReferenceCard,
  generateInterviewQuestionsController,
  generateProjectTutorialController,
  batchGenerateContentController,
  batchGenerateImagesController,
  generateContentWithImageController,
  getMetricsController,
  resetMetricsController
} from '../controllers/aiController.js'

const router = Router()

// 单条生成
router.post('/generate-image', generateImage)
router.post('/generate-deep-article', generateDeepArticle)
router.post('/generate-quick-reference', generateQuickReferenceCard)
router.post('/generate-interview-questions', generateInterviewQuestionsController)
router.post('/generate-project-tutorial', generateProjectTutorialController)
router.get('/quota', getQuotaStatus)
router.post('/match-image', matchImageToCard)

// 批量生成
router.post('/batch-generate-content', batchGenerateContentController)
router.post('/batch-generate-images', batchGenerateImagesController)
router.post('/generate-content-with-image', generateContentWithImageController)

// 性能指标
router.get('/metrics', getMetricsController)
router.post('/metrics/reset', resetMetricsController)

export default router
