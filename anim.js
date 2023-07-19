const
 treshold=100,
 $win = $(window),
 scrEl=$(document.scrollingElement)[0],
 cont=$('.content')[0],
 sections=$('.section').addClass('hidden');

let lastTop= cont.scrollTop, lastGlobalTop = scrEl.scrollTop,
 lastEl, lastI=-1, t0=0;

$(cont).scroll(e=>{
	if (cont.scrollTop == lastTop) return;
	const newTop = cont.scrollTop;
	cont.scrollTop = lastTop;
	scrEl.scrollTop = newTop;
});

requestAnimationFrame(function anim(t) {
	const dt=Math.min(t-t0, 50);
	t0=t;
	requestAnimationFrame (anim);
	document.body.style.height = cont.scrollHeight+'px';
	
	let dGlobal = scrEl.scrollTop - cont.scrollTop,
	 dTop = dGlobal*dt*.01;

	cont.scrollTop+=dTop;
	dTop = cont.scrollTop - lastTop;
	lastTop = cont.scrollTop;
	
	let top, bottom, height;
	let current = sections.filter((i, el)=>{
		({top, bottom, height} = el.getBoundingClientRect());
		//if (lastI*dTop <= i*dTop && (scrEl.scrollTop || !i))
		return top - dGlobal < innerHeight - treshold && bottom - dGlobal > treshold;
	})
	if (current.length > 1) console.log(current)
	lastI = sections.index(current) || lastI;
	//console.log(current[0], current[0].style.opacity, current.hasClass('chap-anim'))
	if (current.hasClass('hidden_')) {
		$('.chapter', current).fadeTo(0, 1).delay(700).fadeOut(700);
		sections.addClass('hidden');
		if (current.removeClass('hidden').hasClass('chap-anim')) {
			current.one('transitionend', e=>{
				if (current.hasClass('hidden')) return;
					let scrTop=current[0].offsetTop;
					if (dTop<0) scrTop += innerHeight - height;
					cont.scrollTop = scrEl.scrollTop = scrTop;
			});
		} else scrEl.scrollTop = 0;
	}
})
//$win.scroll(onScroll).scroll()