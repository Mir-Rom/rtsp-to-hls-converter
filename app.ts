import express from 'express'
import cors from 'cors'
import router from './route.ts'
import { converter } from './controller.ts'
import { API_BASE, HLS_FRAGMENTS_PATH, RTSP_URL } from './config.ts'
const app = express()

app.disable('x-powered-by')

app.use(
	cors({
		origin: true,
		credentials: true,
	})
)
app.use(`${API_BASE}/files`, express.static(HLS_FRAGMENTS_PATH))
app.use('/', router)
if (!RTSP_URL) {
	console.log('Please fill in .env according to an example')
} else {
	app.listen(process.env.SERVER_PORT ?? 3000, () => {
		converter(RTSP_URL!, process.env.noAudio === 'true')

		console.log('Converter started')
	})
}
