import ffmpeg from 'fluent-ffmpeg'
import fs from 'node:fs'
import path from 'node:path'
import { HLS_PATH, HLS_FRAGMENTS_PATH, RTSP_URL } from './config.ts'

if (!fs.existsSync(HLS_PATH)) {
	fs.mkdirSync(HLS_PATH), { recursive: true }
}
if (!fs.existsSync(HLS_FRAGMENTS_PATH)) {
	fs.mkdirSync(HLS_FRAGMENTS_PATH), { recursive: true }
}

async function converter() {
	const ffmpegCommand = ffmpeg(RTSP_URL)
		.inputOptions([
			'-hide_banner',
			'-rtsp_transport tcp',
			'-fflags nobuffer',
			'-flags low_delay',
		])

		.videoCodec('copy')
		.audioCodec('aac')
		.toFormat('hls')
		.outputOption(
			'-hls_segment_filename',
			path.join(HLS_FRAGMENTS_PATH, 'data%03d.ts')
		)
		.outputOptions([
			'-hls_time 5',
			'-hls_flags delete_segments',
			'-hls_segment_type mpegts',
			'-hls_list_size 3',
			'-hls_delete_threshold 1',
		])
		.on('codecData', (data) => console.log(data))
		.on('error', (error) => {
			console.log(error)
		})
		.on('progress', (progress) => console.log(progress))
		.on('end', () => {
			console.log('Stream ended for camera')
		})
		.save(path.join(HLS_PATH, 'rtsp.m3u8'))
}

converter()
