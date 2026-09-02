import * as THREE from 'three'

/** Shared spatial anchors so the core, stream, receiver and camera path all agree on where things are. */
export const CORE_EXIT_POINT = new THREE.Vector3(0.4, -0.1, 0.4)
export const RECEIVER_POSITION = new THREE.Vector3(2.35, -0.55, -1.2)
export const RECEIVER_RADIUS = 0.62
export const RECEIVER_ENTRY_POINT = RECEIVER_POSITION.clone().add(new THREE.Vector3(0, RECEIVER_RADIUS * 0.75, 0))

const STREAM_MID_POINT = new THREE.Vector3(1.35, -1.0, -0.35)

export const STREAM_CURVE = new THREE.CatmullRomCurve3(
  [CORE_EXIT_POINT, STREAM_MID_POINT, RECEIVER_ENTRY_POINT],
  false,
  'catmullrom',
  0.4,
)
