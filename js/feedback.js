/* ভাসমান স্মার্ট ফিডব্যাক বাটন + মডাল ফর্ম */
window.RJF = window.RJF || {};

RJF.renderFeedback = function(){
  var root = document.getElementById('feedback-root');
  if(!root) return;

  root.innerHTML =
    '<div class="fb-tip" id="fbTip">আপনার মতামত জানান</div>' +
    '<button class="fb-btn pulse" id="fbBtn">' + RJF.iconSvg('chat') + '<span class="fb-btn-label">ফিডব্যাক দিন</span></button>' +
    '<div class="fb-overlay" id="fbOverlay">' +
      '<div class="fb-panel">' +
        '<button class="fb-close" id="fbClose" aria-label="বন্ধ করুন">' + RJF.iconSvg('close','width="16" height="16" fill="none" stroke="#1A2420" stroke-width="2"') + '</button>' +
        '<h3>আপনার মতামত জানান</h3>' +
        '<p>আমাদের কার্যক্রম সম্পর্কে আপনার অভিজ্ঞতা ও পরামর্শ শেয়ার করুন।</p>' +
        '<form id="fbForm">' +
          '<div class="fb-field"><label for="fbName">নাম</label><input type="text" id="fbName" placeholder="আপনার নাম" required></div>' +
          '<div class="fb-field"><label for="fbEmail">ইমেইল / ফোন (ঐচ্ছিক)</label><input type="text" id="fbEmail" placeholder="যোগাযোগের মাধ্যম"></div>' +
          '<div class="fb-field"><label>রেটিং</label><div class="fb-stars" id="fbStars">' +
            [1,2,3,4,5].map(function(v){ return '<button type="button" data-v="' + v + '">' + RJF.iconSvg('star','fill="currentColor"') + '</button>'; }).join('') +
          '</div></div>' +
          '<div class="fb-field"><label for="fbMsg">মতামত</label><textarea id="fbMsg" rows="3" placeholder="আপনার মতামত লিখুন..." required></textarea></div>' +
          '<button type="submit" class="fb-submit">জমা দিন</button>' +
        '</form>' +
      '</div>' +
    '</div>' +
    '<div class="fb-toast" id="fbToast">ধন্যবাদ! আপনার মতামত পাঠানো হয়েছে।</div>';

  var fbTip = document.getElementById('fbTip');
  setTimeout(function(){ fbTip.classList.add('show'); }, 3000);
  setTimeout(function(){ fbTip.classList.remove('show'); }, 8000);

  var fbBtn = document.getElementById('fbBtn');
  var fbOverlay = document.getElementById('fbOverlay');
  var fbClose = document.getElementById('fbClose');
  var fbForm = document.getElementById('fbForm');
  var fbToast = document.getElementById('fbToast');
  var fbStars = document.getElementById('fbStars');
  var ratingValue = 0;

  function openFb(){ fbOverlay.classList.add('open'); fbBtn.classList.remove('pulse'); fbTip.classList.remove('show'); }
  function closeFb(){ fbOverlay.classList.remove('open'); }

  fbBtn.addEventListener('click', openFb);
  fbClose.addEventListener('click', closeFb);
  fbOverlay.addEventListener('click', function(e){ if(e.target === fbOverlay) closeFb(); });

  fbStars.querySelectorAll('button').forEach(function(btn){
    btn.addEventListener('click', function(){
      ratingValue = Number(btn.dataset.v);
      fbStars.querySelectorAll('button').forEach(function(b){
        b.classList.toggle('active', Number(b.dataset.v) <= ratingValue);
      });
    });
  });

  fbForm.addEventListener('submit', function(e){
    e.preventDefault();
    var payload = {
      name: document.getElementById('fbName').value,
      contact: document.getElementById('fbEmail').value,
      rating: ratingValue,
      message: document.getElementById('fbMsg').value,
      createdAt: new Date().toISOString()
    };

    /*
      Firebase Firestore-এ পাঠাতে চাইলে:
      import { initializeApp } from "firebase/app";
      import { getFirestore, collection, addDoc } from "firebase/firestore";
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      await addDoc(collection(db, "feedback"), payload);
      এখনো ব্যাকএন্ড যুক্ত করা হয়নি — আপাতত কনসোলে দেখাচ্ছে।
    */
    console.log('Feedback submitted:', payload);

    fbForm.reset();
    ratingValue = 0;
    fbStars.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
    closeFb();
    fbToast.classList.add('show');
    setTimeout(function(){ fbToast.classList.remove('show'); }, 3200);
  });
};
