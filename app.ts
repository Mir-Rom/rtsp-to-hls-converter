import express from 'express'
import cors from 'cors'
import router from './route.ts'
import { converter } from './controller.ts'
import fs from 'node:fs'
import path from 'node:path'
import {
	API_BASE,
	HLS_FRAGMENTS_PATH,
	HLS_PLAYLIST_PATH,
	RTSP_URL,
} from './config.ts'
const app = express()

app.disable('x-powered-by')

app.use(
	cors({
		origin: true,
		credentials: true,
	})
)

process.on('SIGINT', () => {
	const hlsPath = path.join(import.meta.dirname, 'hls')
	if (fs.existsSync(hlsPath)) {
		fs.rmSync(hlsPath, { recursive: true, force: true })
	}
	process.exit(0)
})

app.use(`${API_BASE}/files`, express.static(HLS_FRAGMENTS_PATH))
app.use(`${API_BASE}/hls/hls_fragments/`, express.static(HLS_FRAGMENTS_PATH))
app.use('/', router)
if (!RTSP_URL) {
	console.log('Please fill in .env according to an example')
} else {
	app.listen(process.env.SERVER_PORT ?? 3000, () => {
		converter(RTSP_URL!, process.env.noAudio === 'true')

		console.log('Converter started')
	})
}
