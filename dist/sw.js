const staticCacheName = 's-app-v2',
	dynamicCacheName = 'd-app-v2'
assetUrls = [
	'./index.html',
	'./src.44259429.js',
	'./main.6d8a7b85.css',
	'./offline.html'
]

self.addEventListener('install', async e => {
	const cache = await caches.open(staticCacheName)
	await cache.addAll(assetUrls)

})
self.addEventListener('activate', async e => {
	const cacheNames = await caches.keys()
	await Promise.all(
		cacheNames.filter(name => name !== staticCacheName).filter(name => name !== dynamicCacheName).map(name => caches.delete(name))

	)
})
self.addEventListener('fetch', e => {
	const { request } = e
	const url = new URL(request.url)
	if (url.origin === location.origin) {
		e.respondWith(cacheFirst(request))
	} else {
		e.respondWith(networkFirst(request))
	}

})
async function cacheFirst(request) {
	const cached = await caches.match(request)
	return cached ?? await fetch(request)
}
async function networkFirst(request) {
	const cache = await caches.open(dynamicCacheName)
	try {
		const responce = await fetch(request)
		await cache.put(request, responce.clone())
		return responce
	} catch (e) {
		const cached = await cache.match(request)
		return cached ?? await caches.match('./offline.html')
	}


}