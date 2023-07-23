const
 treshold=100,
 animTimeout=1000, //time for scroll blocking in milliseconds
 $win = $(window),
 $cont=$(document.scrollingElement), cont = $cont[0],
 sections=$('.section').addClass('hidden ready');

let lastGlobalTop, lastTop=-1, lastTimer,
 lastEl, blocked, targTop=-1, lastI=-1, t0=0;

requestAnimationFrame(function anim(t) {
	const dt=Math.min(t-t0, 50);
	t0=t;
	requestAnimationFrame (anim);

	//if (lastTop<0) lastTop = cont.scrollTop;
	//if (targTop > -1) cont.scrollTop = targTop;
	
	let dGlobal = cont.scrollTop - lastTop,
	 dTop = dGlobal*dt*(targTop<10? .01 : .003);

	lastTop = cont.scrollTop;

	if (lastEl && !dGlobal) return;
	
	const halfH = innerHeight/2;

	let current = sections.filter((i, el)=>{
		const {top, bottom, height} = el.getBoundingClientRect();
		if (!lastEl) return top<halfH && bottom > halfH;
		if (el==lastEl) return false; // || targTop > -1
		if (dGlobal < 0) return top < treshold && bottom > treshold;
		return top < innerHeight - treshold && bottom > innerHeight - treshold;
	})[0];
	if (!current) return; // || targTop > -1

	const {top, bottom} = current.getBoundingClientRect();

	targTop = cont.scrollTop + (dGlobal >= 0? top : bottom - innerHeight);

	sections.addClass('hidden');
	current.classList.remove('hidden');
	lastEl = current;
	clearTimeout(lastTimer);
	//$cont.stop();

	if (current.classList.contains('section0')) cont.scrollTop = 0

	else lastTimer = setTimeout(()=>{
		if (current.classList.contains('hidden')) return;
		lasttop = cont.scrollTop = targTop;
		targTop = -1;
	}, animTimeout) //
})

gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);

function titleAnim() {
	const gsapTitle = gsap.utils.toArray('.section__wrapp');
	gsapTitle.forEach((gsTl) => {
    let titleAnim = $(gsTl).find('h2');
		let tl = gsap.timeline({
      scrollTrigger: {
        trigger: gsTl,
        start: "top center",
        // end: "+=1500",
        // markers: true,
        scrub: 0.5,
        pin: true,
        refreshPriority: 1
      }
    });
    tl.to(titleAnim, 0.2, { x: 50, ease: "none" })
	});
}
titleAnim();