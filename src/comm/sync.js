import { upload, removeFile, req } from '@/comm/zz'
import { hadNet, getStorage } from '@/comm/comm'

const sync = {
	removeFile,
	upload,
	req,
	// async req(data={},fn='5618',t=9999) {
	// 	let api = { 
	// 		5618: 'https://996909cb-e5ca-4be8-8150-b60ae2422186.bspapp.com/sync', 
	// 		'zts': 'https://699d1eb1-ee53-4c66-bddd-06cda80d1231.bspapp.com/sync'
	// 	}
	// 	return new Promise((resolve, reject) => {
	// 		let timer,x
	// 		// #ifdef APP-PLUS
	// 		x = new plus.net.XMLHttpRequest()
	// 		// #endif
	// 		// #ifndef APP-PLUS
	// 		x = window.XMLHttpRequest? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")
	// 		// #endif

	// 		x.open('POST',api[fn],true)
	// 		x.setRequestHeader("Content-type","application/json")
	// 		x.setRequestHeader("authorization", getStorage('210B33A_token'))
	// 		x.setRequestHeader("clientInfo", JSON.stringify(getStorage('clientInfo')))
	// 		x.send(JSON.stringify(data))
			
	// 		x.onreadystatechange = ()=>{
	// 			clearInterval(timer)
	// 			if (x.readyState === 4) {
	// 				let e = JSON.parse(x.responseText)
	// 				if (x.status >= 200 && x.status < 300 || x.status == 304) {
	// 					if(e.code==1000) {
	// 						resolve(e.data)
	// 					} else{
	// 						reject(e.message)
	// 					}
	// 				}else{
	// 					reject(e.error.message)
	// 				}
	// 			}
	// 		}
	// 		//超时
	// 		if(t){
	// 			timer = setInterval(()=>{
	// 				console.log('timedout!')
	// 				x.abort()
	// 				clearInterval(timer)
	// 			},t)
	// 		}
	// 	})
	// },
	get(){ return uni.getStorageSync('sync_task') || {r:Date.now()-20000,q:[]} },
	set(o){ uni.setStorageSync('sync_task', o) },
	add(o,k='req',sync=true){
		let tk = this.get()
		tk.q.push({o,k})
		this.set(tk)
		if(sync) {
			this.go()
		}
	},
	addFile(k,v){
		let f = uni.getStorageSync('sync_files')||{}
		f[k] = v
		uni.setStorageSync('sync_files', f)
	},
	
	async go(){
		if(hadNet()) {
			let tk = this.get(),
				now = Date.now()
			// console.log((now-tk.r),'task.start --->', tk);
			if((now-tk.r)>=20000) {
				tk.r = now
				this.set(tk)
				for (var i = 0; i < tk.q.length; i++) {
					let q = tk.q[i],
						u,
						v
					
					if(q.k=='req'){
						u = q.o.$url
						q.o.$fn = 'sync'
					} 
					await this[q.k](q.o).then(x=>{
						v = x
					}).catch(e=>{
						if(q.k=='req') q.o.$url = u
						this.set(tk)
						return setTimeout(()=>{this.go()}, 20001)
					})
					// console.log(v);
					if(v){
						tk.q.splice(i,1)
						this.set(tk)
						i--
						if(q.k=='upload') {
							this.addFile(q.o,v)
							tk.q.unshift({o:{$url:'/user/rec/sync',file:{k:q.o,v}},k:'req'})
							tk.r-=20000
							this.set(tk)
							return this.go()
						}
						if(v.startTime) {
							let temp = uni.getStorageSync('tempfiles')||[],
								local = uni.getStorageSync('nav_local_rec')||[],
								f = uni.getStorageSync('sync_files')||{}
							
							for (let u of temp) {
								if(!u.startsWith('http')) {
									removeFile(u)
									delete f[u]
								}
							}
							
							uni.setStorageSync('sync_files',f)
							uni.removeStorageSync('tempfiles')
							
							let idx = local.findIndex(s=>s.startTime==v.startTime)
							if(idx!=-1) {
								local.splice(idx,1)
								uni.setStorageSync('nav_local_rec', local)
							}
						}
					}
				}
				tk.r-=20000
				this.set(tk)
			} else {
				// setTimeout(()=>{this.go()}, 20000 - (now-tk.r));
			}
			// console.log(Date.now() - now,'task.finish --->', tk);
		}
	}
}

module.exports = sync