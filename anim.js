const
 treshold=100,
 animTimeout=1000, //time for scroll blocking in milliseconds
 bottomPosition = 1.5, // = 150% of viewport height. When scrolling up, bottom of the active element is placed in this position.

 $win = $(window),
 $cont=$(document.scrollingElement), cont = $cont[0],
 sections=$('.section').addClass('hidden ready');

let lastGlobalTop, lastTop=-1, lastTimer,
 lastEl, targEl=$(':target', cont)[0],
 blocked, targTop=-1, lastI=-1, t0=0;

$win.on('hashchange', e=>targEl=$(':target', cont)[0])

requestAnimationFrame(function anim(t) {
	const dt=Math.min(t-t0, 50);
	t0=t;
	requestAnimationFrame (anim);

	//if (lastTop<0) lastTop = cont.scrollTop;
	//if (targTop > -1) cont.scrollTop = targTop;
	
	let dGlobal = cont.scrollTop - lastTop,
	 dTop = dGlobal*dt*(targTop<10? .01 : .003);

	lastTop = cont.scrollTop;

	if (!targEl && lastEl && !dGlobal) return;
	
	const halfH = innerHeight/2;

	let current = targEl || sections.filter((i, el)=>{
		const {top, bottom, height} = el.getBoundingClientRect();
		if (!lastEl) return top<halfH && bottom > halfH;
		if (el==lastEl) return false; // || targTop > -1
		if (dGlobal < 0) return top < treshold && bottom > treshold;
		return top < innerHeight - treshold && bottom > innerHeight - treshold;
	})[0];
	if (!current) return; // || targTop > -1

	const {top, bottom} = current.getBoundingClientRect();

	targTop = cont.scrollTop + (dGlobal >= 0 || targEl ? top : bottom - innerHeight*bottomPosition);

	sections.addClass('hidden');
	current.classList.remove('hidden');
	lastEl = current;
	clearTimeout(lastTimer);
	targEl = null;
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
	const easeFn = x=>x*x + x*x*(1-x), easeBack = x=> 1 - easeFn(1-x); // custom easing, interpolation between linear and Power1
	const gsapTitle = gsap.utils.toArray('.section__wrapp');
	sections.not('.section0').each((i, section) => {
    const titleAnim = $('.section__wrapp h2', section);
    const wrap = $('.section__wrapp', section);

		const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom center",
        // markers: true,
        scrub: 0.5,
        //pin: true,
        refreshPriority: 1
      }
    }).to(titleAnim, .92, { x: 50, ease: easeBack });

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "bottom 150%",
        end: "bottom 50%",
        // markers: true,
        scrub: 0.5,
        //pin: true,
        refreshPriority: 1
      }
    }).to(wrap, 1, { y: '-100%', ease: Power1.easeIn})

    //console.log (tl.getChildren())

	});
}
titleAnim();