const
 treshold=100,
 animTimeout=1500, //time for scroll blocking
 $win = $(window),
 scrEl=$(document.scrollingElement)[0],
 cont=$('.content')[0],
 sections=$('.section').addClass('hidden');

let lastTop= cont.scrollTop, lastGlobalTop = scrEl.scrollTop,
 lastEl, blocked, targTop=-1, lastI=-1, t0=0;

console.log($('nav').on('click', 'a[href^="#"]', function(e){
	console.log(this);
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
}).find('a[href="'+location.hash+'"]').click());


requestAnimationFrame(function anim(t) {
	const dt=Math.min(t-t0, 50);
	t0=t;
	requestAnimationFrame (anim);
	document.body.style.height = cont.scrollHeight+'px';

	if (targTop > -1) scrEl.scrollTop = targTop;
	
	let dGlobal = scrEl.scrollTop - cont.scrollTop,
	 dTop = dGlobal*dt*(targTop<10? .01 : .003);

	cont.scrollTop+=dTop;
	dTop = cont.scrollTop - lastTop;
	lastTop = cont.scrollTop;

	if (lastEl && (!dTop || !dGlobal)) return;
	
	const halfH = innerHeight/2;

	let current = sections.filter((i, el)=>{
		const {top, bottom, height} = el.getBoundingClientRect();
		//if (lastI*dTop <= i*dTop && (scrEl.scrollTop || !i))
		if (!el.classList.contains('hidden')) {
			const progress = Math.min(Math.max(0, -top / (height - innerHeight*1.5)), 1);
			el.style.setProperty('--progress', progress);
		}
		if (!lastEl) return top>=0 && top<halfH || bottom<=innerHeight && bottom > halfH;
		if (el==lastEl || targTop > -1) return false;
		if (dGlobal < 0) return top - dGlobal < treshold && bottom - dGlobal > treshold;
		return top - dGlobal < innerHeight - treshold && bottom  - dGlobal > innerHeight - treshold;
	});
	if (!current[0] || targTop > -1) return;

	const {top, bottom} = (current[0] || lastEl).getBoundingClientRect();

	targTop = scrEl.scrollTop = cont.scrollTop + (dGlobal >= 0? top : bottom - innerHeight*1.5);
	chAnim(current);
});
function chAnim(current){

	sections.addClass('hidden');
	current.removeClass('hidden');
	lastEl = current[0];

	//$('.chapter', current).fadeTo(0, 1).delay(800).fadeOut(900);
	setTimeout(()=>{
	//if (current.hasClass('chap-anim')) {
			if (current.hasClass('hidden')) return;
			lasttop = cont.scrollTop;
			targTop = -1;
	//};
	}, 2000) // else scrEl.scrollTop = 0;
}
//$win.scroll(onScroll).scroll()