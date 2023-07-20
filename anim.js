const
 treshold=100,
 $win = $(window),
 scrEl=$(document.scrollingElement)[0],
 cont=$('.content')[0],
 sections=$('.section').addClass('hidden');

let lastTop= cont.scrollTop, lastGlobalTop = scrEl.scrollTop,
 lastEl, blocked, targTop=-1, lastI=-1, t0=0;
$('nav').on('click', 'a[href^="#"]', function(e){
	$(cont).on('scroll', function scr(e){
		if (e.target != cont) return;
		$(cont).off('scroll', scr);
		if (cont.scrollTop == lastTop) return;
		const newTop = cont.scrollTop;
		cont.scrollTop = lastTop;
		scrEl.scrollTop = newTop;

		const current = $(location.hash).not(lastEl)
		console.log(e.target == cont);
		if (!current[0]) return;
		targTop = newTop;
		chAnim(current);
	});
})

requestAnimationFrame(function anim(t) {
	const dt=Math.min(t-t0, 50);
	t0=t;
	requestAnimationFrame (anim);
	document.body.style.height = cont.scrollHeight+'px';

	if (targTop > -1) scrEl.scrollTop = targTop;
	
	let dGlobal = scrEl.scrollTop - cont.scrollTop,
	 dTop = dGlobal*dt*.01;

	cont.scrollTop+=dTop;
	dTop = cont.scrollTop - lastTop;
	lastTop = cont.scrollTop;

	if (lastEl && (!dTop || !dGlobal || targTop > -1)) return;
	
	const halfH = innerHeight/2;

	let current = sections.filter((i, el)=>{
		const {top, bottom} = el.getBoundingClientRect();
		//if (lastI*dTop <= i*dTop && (scrEl.scrollTop || !i))
		if (!lastEl) return top>=0 && top<halfH || bottom<=innerHeight && bottom > halfH;
		if (el==lastEl) return false;
		if (dGlobal < 0) return top - dGlobal < treshold && bottom - dGlobal > treshold;
		return top - dGlobal < innerHeight - treshold && bottom  - dGlobal > innerHeight - treshold;
	});

	if (!current[0]) return;
	let {top, bottom} = current[0].getBoundingClientRect();
	targTop = scrEl.scrollTop = cont.scrollTop + (dGlobal >= 0? top : bottom - innerHeight*1.5);
	console.log(dGlobal);

	chAnim(current);
});
function chAnim(current){

	sections.addClass('hidden');
	current.removeClass('hidden');
	lastEl = current[0];

	$('.chapter', current).fadeTo(0, 1).delay(700).fadeOut(700);
	setTimeout(()=>{
	//if (current.hasClass('chap-anim')) {
			if (current.hasClass('hidden')) return;
			lasttop = cont.scrollTop;
			targTop = -1;
	//};
	}, 1200) // else scrEl.scrollTop = 0;
}
//$win.scroll(onScroll).scroll()