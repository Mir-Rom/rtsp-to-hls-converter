import path from 'path'

export const API_BASE = '/api'

export const HLS_PATH = path.join(import.meta.dirname, 'hls')
export const HLS_FRAGMENTS_PATH = path.join(HLS_PATH, 'hls_fragments')
export const HLS_PLAYLIST_PATH = path.join(HLS_PATH, 'rtsp.m3u8')
export const RTSP_URL = process.env.RTSPURL
export const STATIC_PATH_TO_FILES = `${API_BASE}/files`
export const ROUTES = { GET_STREAM: `${API_BASE}/stream` }
