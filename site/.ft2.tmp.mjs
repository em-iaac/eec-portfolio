import puppeteer from 'puppeteer'
const b=await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']})
for (const [w,h,label] of [[390,844,'PHONE  '],[1440,900,'DESKTOP']]) {
  const p=await b.newPage(); await p.setViewport({width:w,height:h,hasTouch:w<1024,isMobile:w<1024})
  for (const route of ['/work','/rights','/']) {
    await p.goto('http://localhost:5174'+route,{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1100))
    const o=await p.evaluate(()=>{
      const f=document.querySelector('footer'); if(!f) return {footer:'none'}
      const vis=e=>e&&e.getBoundingClientRect().width>0
      const credit=[...f.querySelectorAll('a')].filter(a=>/©/.test(a.textContent)&&vis(a))
      const icons=[...f.querySelectorAll('a')].filter(a=>!/©/.test(a.textContent)&&vis(a))
      const bareName=[...f.querySelectorAll('span')].filter(s=>s.textContent.trim()==='EMILIE EL CHIDIAC'&&vis(s))
      const first=icons.find(a=>!/PDF|BOOK/.test(a.textContent))
      const c=credit[0]
      return {h:Math.round(f.getBoundingClientRect().height), creditCount:credit.length,
        bareNameSpans:bareName.length,
        creditText:c?c.innerText.replace(/\s+/g,' ').trim():null,
        creditOnSameRowAsIcons: c&&first? Math.abs(c.getBoundingClientRect().top-first.getBoundingClientRect().top)<20 : null,
        creditRightOfIcons: c&&first? c.getBoundingClientRect().left>first.getBoundingClientRect().left : null}
    })
    console.log(`${label} ${route.padEnd(8)}`, JSON.stringify(o))
  }
  await p.close()
}
await b.close()
