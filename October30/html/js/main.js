// @ts-check
// var addToGPU = function(t) {
//   renderer.setTexture2D(t, 0);
// };

var vertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

var fragment = `
varying vec2 vUv;

uniform float mixRatio;
uniform float threshold;

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D mixTexture;

void main() {
  vec4 texel1 = texture2D( texture1, vUv );
  vec4 texel2 = texture2D( texture2, vUv );
  vec4 transitionTexel = texture2D( mixTexture, vUv );
  float r = mixRatio * (1.0 + threshold * 2.0) - threshold;
  float mixf = clamp((r - transitionTexel.r) * (1.0 / threshold), 0.0, 1.0);
  gl_FragColor = mix( texel1, texel2, mixf );
}
`;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

var started = false;

const animationSpeed = 3;
const nextDelay = 5 * 1000;

function startup() {
  if (started) return;
  started = true;
  const ids = Array(371).fill(0).map((_, idx) => idx + 1)
  shuffleArray(ids)

  const $baseImage = document.getElementById('base-image')
  const $container = document.getElementById('container')

  var mixTexture = "img/noise3.png"
  var image1 = 'img/logos/0.png'
  var image2 = `img/logos/${ids[0]}.jpg`
  const threshold = 0.3

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(
    $container.offsetWidth / -2,
    $container.offsetWidth / 2,
    $container.offsetHeight / 2,
    $container.offsetHeight / -2,
    1,
    1000
  )
  camera.position.z = 1
  const renderer = new THREE.WebGLRenderer({
    antialias: false
  })

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0xf8f8f8, 0.0)
  renderer.setSize($container.offsetWidth, $container.offsetHeight)
  renderer.domElement.setAttribute('class', 'away')
  $container.appendChild(renderer.domElement)

  const loader = new THREE.TextureLoader()

  var texture1 = loader.load(image1)
  var texture2 = loader.load(image2)

  var mixTexture = loader.load(mixTexture)
  mixTexture.wrapS = mixTexture.wrapT = THREE.RepeatWrapping

  texture1.magFilter = texture2.magFilter = THREE.LinearFilter
  texture1.minFilter = texture2.minFilter = THREE.LinearFilter

  texture1.anisotropy = renderer.getMaxAnisotropy()
  texture2.anisotropy = renderer.getMaxAnisotropy()

  var mat = new THREE.ShaderMaterial({
    uniforms: {
      threshold: { type: "f", value: threshold },
      mixRatio: { type: "f", value: 0.0 },
      texture1: { type: "t", value: texture1 },
      texture2: { type: "t", value: texture2 },
      mixTexture: { type: "t", value: mixTexture }
    },

    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    opacity: 1.0
  })
  const geometry = new THREE.PlaneBufferGeometry(
    $container.offsetWidth,
    $container.offsetHeight,
    1
  )
  const object = new THREE.Mesh(geometry, mat)
  scene.add(object)

  var imageCount = 0

  setTimeout(() => {
    renderer.domElement.setAttribute('class', '')
    TweenLite.to(mat.uniforms.mixRatio, animationSpeed, {
      value: 1,
      onComplete: () => {
        $baseImage.setAttribute('src', image2);
        setTimeout(() => { renderer.domElement.setAttribute('class', 'away') }, 100)
        setTimeout(() => { animateToNextImage() }, nextDelay)
      }
    })
  }, 100)

  const animateToNextImage = () => {
    imageCount += 1
    var imageIndex = imageCount % ids.length

    image1 = image2
    image2 = `img/logos/${ids[imageIndex]}.jpg`

    texture1 = texture2
    object.material.uniforms.texture1.value = texture1

    texture2 = loader.load(image2)
    texture2.magFilter = THREE.LinearFilter
    texture2.minFilter = THREE.LinearFilter
    texture2.anisotropy = renderer.getMaxAnisotropy()
    object.material.uniforms.texture2.value = texture2

    object.material.uniforms.mixRatio.value = 0.0

    setTimeout(() => {
      renderer.domElement.setAttribute('class', '')
      TweenLite.to(mat.uniforms.mixRatio, animationSpeed, {
        value: 1,
        onComplete: () => {
          $baseImage.setAttribute('src', image2);
          setTimeout(() => { renderer.domElement.setAttribute('class', 'away') }, 100)
          setTimeout(() => { animateToNextImage() }, nextDelay)
        }
      });
    }, 100)
  }

  window.addEventListener("resize", (e) => {
    renderer.setSize($container.offsetWidth, $container.offsetHeight)
  })

  var animate = function() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate()
}
