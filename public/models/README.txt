Drop optimized .glb / .gltf models here (Draco/KTX2-compressed where possible).

The cinematic scene currently uses procedural geometry (no external models required)
so the site works out of the box. To upgrade a scene object to a real model:

1. Place the file here, e.g. /public/models/core.glb
2. Load it with useGLTF('/models/core.glb') from '@react-three/drei'
3. Swap the procedural mesh in src/three/objects/ for the loaded scene graph,
   keeping the same ref/animation hookups from src/animations/objectAnimations.ts
