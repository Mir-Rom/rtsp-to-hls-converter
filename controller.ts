import ffmpeg from 'fluent-ffmpeg'
import fs from 'node:fs'
import path from 'node:path'
import {
	HLS_PATH,
	HLS_FRAGMENTS_PATH,
	HLS_PLAYLIST_PATH,
	STATIC_PATH_TO_FILES,
} from './config.ts'
if (!fs.existsSync(HLS_PATH)) {
	fs.mkdirSync(HLS_PATH), { recursive: true }
}
if (!fs.existsSync(HLS_FRAGMENTS_PATH)) {
	fs.mkdirSync(HLS_FRAGMENTS_PATH), { recursive: true }
}
export function converter(RTSP_URL: string, noAudio = true) {
	const ffmpegCommand = ffmpeg()
		.input(RTSP_URL)
		.inputOption('-ss 3')
		.inputOptions([
			'-hide_banner',
			'-rtsp_transport tcp',
			'-use_wallclock_as_timestamps 1',
			'-fflags +genpts',
			'-strict 5',
			'-fflags discardcorrupt',
			'-loglevel debug',
			'-flags low_delay',
			'-fflags latm',
			'-fflags nobuffer',
			'-probesize 32M',
			'-analyzeduration 0',
			'-r:0 12',
		])
		.outputOption(
			'-hls_segment_filename',
			path.join(HLS_FRAGMENTS_PATH, 'data%03d.m4s')
		)
		.toFormat('hls')
		.outputOptions([
			'-c:v copy',
			'-preset ultrafast',
			'-tune zerolatency',
			'-g 18',
			'-keyint_min 18',
			'-sc_threshold 0',
			'-hls_time 1.5',
			'-hls_list_size 4',
			'-hls_flags delete_segments+append_list+omit_endlist+independent_segments',
			'-hls_delete_threshold 2',
			'-flush_packets 1',
			'-max_delay 0',
			'-avioflags direct',
			'-hls_segment_type fmp4',
			'-hls_init_time 1',
			`-hls_fmp4_init_filename hls/hls_fragments/init.mp4`,
			`-hls_base_url ${STATIC_PATH_TO_FILES}/`,
		])
		.output(HLS_PLAYLIST_PATH)
		.on('start', (cmd) => console.log('FFmpeg command:', cmd))
		// .on('codecData', (data) => console.log('CodecData', data))
		.on('stderr', (line) => {
			console.log(line)
		})
		.on('error', (err) => console.error('FFmpeg error:', err))
		.on('progress', (prog) => console.log('Progress:', prog))
		.on('end', () => console.log('Stream ended'))
	if (noAudio) {
		ffmpegCommand.audioCodec('aac')
		ffmpegCommand.audioChannels(2)
	} else {
		ffmpegCommand.noAudio()
	}
	ffmpegCommand.run()
}
