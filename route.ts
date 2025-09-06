import { Router } from 'express'
import { HLS_PLAYLIST_PATH, ROUTES, RTSP_URL } from './config.ts'
import { converter } from './controller.ts'

import type { Request } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'
const router = Router()

router.get(
	ROUTES.GET_STREAM,
	(
		request: Request<ParamsDictionary, unknown, unknown, { noAudio?: boolean }>,
		response
	) => {
		console.log('aboba')
		if (!RTSP_URL) {
			response.status(400).json({
				message: 'Please fill in .env according to an example',
			})
		}
		response.sendFile(HLS_PLAYLIST_PATH)
	}
)
export default router
