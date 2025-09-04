import path from 'path'

export const HLS_PATH = path.join(import.meta.dirname, 'hls')
export const HLS_FRAGMENTS_PATH = path.join(HLS_PATH, 'hls fragments')
export const RTSP_URL = process.env.RTSPURL
