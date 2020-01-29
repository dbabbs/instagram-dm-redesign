const $ = q => document.querySelector(q);
const $$ = q => document.querySelectorAll(q);

const STATE = {
   overlayOpen: false
}
const [ time, amPm ]= new Date().toLocaleTimeString().split(' ');
const shortTime = time.split(':')[0] + ':' + time.split(':')[1] ;
console.log(shortTime)
$('#date').innerText = shortTime + ' ' + amPm;

const posts = [
   {
      username: 'historyinmemes',
      likes: '18,812',
      description: 'Cleaned this old meme up',
      postTime: 'January 22'
   },
   {
      username: 'igpups',
      likes: '29,933',
      description: `So cute!`,
      postTime: 'April 25, 2019'
   }
];

const profiles = [
   {
      username: 'barackobama',
      name: 'Barack Obama',
      following: true
   },
   {
      username: 'terriblemap',
      name: 'Terrible Maps',
      following: true
   },
   {
      username: 'leomessi',
      name: 'Leo Messi',
      following: false
   },
   {
      username: 'flighthacks',
      name: 'Immanuel Debeer',
      following: true
   },
   {
      username: 'bradythegolden',
      name: 'Brady The Golden',
      following: true
   },
   {
      username: 'nasa',
      name: 'NASA',
      following: false
   }
]

const PostContainer = ({ username, likes, description, postTime }) => {
   const node = document.createElement('div');
   node.classList.add('post-container');
   node.innerHTML = `\n
<div class="post-top-bar">
   <div class="username-profile standard-text">
      <div class="profile-img" style="background: url('img/profiles/${username}.png'); background-size: contain; background-repeat: no-repeat;"></div>
      <div>${username}</div>
   </div>
</div>
<img class="img" src="img/post/${username}.png" />
<div class="icon-row">
   <div class="left">
      <img class="icon heart" src="img/icons/heart_white.jpeg" />
      <img class="icon" src="img/icons/comment_white.jpeg" />
      <img class="icon send" src="img/icons/send_white.jpeg" />
   </div>
   <img class="icon" src="img/icons/bookmark_white.png" />
</div>
<div class="like-count standard-text">${likes} likes</div>
<div class="username-descrption">
   <span class="standard-text">${username}</span>
   <span class="standard-text"> </span>
   <span class="light-text">${description}</span>
</div>
<div class="post-time">${postTime}</div>`
   return node;
}

const ProfileRow = ({ username, name, following }) => {
   const lightGrey = '#9F9F9F';
   const green = '#70C050';
   const red = '#ED4956';
   const color = following ? green /*'*/ : lightGrey;
   const text = following ? 'Following' : 'Not following';
   const node = document.createElement('div');
   const dot = '&#8226;';
   node.classList.add('profile-row');

   const profileColor = following ? '#000' : lightGrey; 

   const transparency = following ? 1 : 0.3;

   node.dataset.checked = 'no';
   node.innerHTML = `\n
   <div class="left">
      <img style="opacity: ${transparency};" src="img/profiles/${username}.png">
      <div>
         <div style="color: ${profileColor};" class="profile-row-text">
            ${username}
         </div>
         <div class="profile-row-description">
            
            <span class="following-boolean" style="color: ${color};">${text}</span>
         </div>
      </div>
   </div>
   <div class="check">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M6.61 11.89L3.5 8.78 2.44 9.84 6.61 14l8.95-8.95L14.5 4z"/></svg>
   </div>
   `
   return node;
}

posts.forEach(
   item => $('.posts').appendChild(PostContainer(item)) 
)

profiles.forEach(
   item => $('.overlay-content').appendChild(ProfileRow(item)) 
)

const sendButtons = $$('.send');
sendButtons.forEach(
   (button, index) => button.onclick = evt => share(index)
)

const profileRows = $$('.profile-row');
profileRows.forEach(
   (profileRow, index) => profileRow.onclick = evt => handleProfileRowClick(evt, index)
)

function handleProfileRowClick({target}, index) {
   const { following } = profiles[index];
   const checked = target.dataset.checked === 'yes';
   if (following && !checked) {
      handleCheckMark(index, 'check')
   } else if (following && checked) {
      handleCheckMark(index, 'uncheck')
   } else {
      target.classList.add('shake')
      setTimeout(() => {
         target.classList.remove('shake')
      }, 500)
   }

   updatePotentialSends();
}

function countChecks() {
   const profileNodes = $$('.profile-row');
   let count = 0;
   profileNodes.forEach(p => {
      if (p.dataset.checked === 'yes') {
         count++;
      }
   })
   return count;
}

function updatePotentialSends() {
   const count = countChecks();
   $('.overlay-send').innerText = 'Send'
   if (count > 0) {
      $('.overlay-send').style.background = 'var(--blue)';
      if (count > 1) {
         $('.overlay-send').innerText = 'Send Separately'
      }
   } else {
      $('.overlay-send').style.background = 'var(--send-grey)';
      
   }
}

function handleCheckMark(index, action) {
   const node = $$('.check')[index];
   const profileRowNode = $$('.profile-row')[index]
   if (action === 'check') {
      node.style.background = 'var(--blue)';
      node.style.border = 'none';
      profileRowNode.dataset.checked = 'yes';
   } else {
      node.style.background = 'white';
      node.style.border = '0.5px solid #CBCBCB';
      profileRowNode.dataset.checked = 'no';
   }
}







function share(index) {
   const { username } = posts[index];
   if (!STATE.overlayOpen) {
      openOverlay(username);
   } else {
      closeOverlay();
   }
}

function openOverlay(username) {
   //transparent mask
   $('.mask').style.opacity = 0.5;
   $('.mask').style.visibility = 'visible';
   
   //Set username
   $('#private-username').innerText = username;
   //Overlay
   $('.overlay').style.transform = 'translateY(0%)';

   STATE.overlayOpen = !STATE.overlayOpen;
}

function closeOverlay() {
   //transparent mask
   $('.mask').style.opacity = 0;
   $('.mask').style.visibility = 'hidden';

   //overlay
   $('.overlay').style.transform = 'translateY(100%)';
   STATE.overlayOpen = !STATE.overlayOpen;
}

$('.mask').onclick = () => closeOverlay();

$('.overlay-send').onclick = () => sendMessage();

function sendMessage() {
   const count = countChecks();
   if (count > 0) {
      closeOverlay();
      console.log('y')
      $('.notif').style.visibility = 'visible';
      $('.notif').style.opacity = 1;
      setTimeout(() => {
         $('.notif').style.visibility = 'hidden';
         $('.notif').style.opacity = 0;
      }, 3000)
      
      //uncheck all boxes
      $$('.profile-row').forEach((row, index) => {
         handleCheckMark(index, 'uncheck')
         
      })
      updatePotentialSends()
      
   }
}