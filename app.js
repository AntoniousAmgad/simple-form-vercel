// Simple church member form handler
// IMPORTANT: set `GAS_URL` to your deployed Google Apps Script Web App URL
const GAS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

const form = document.getElementById('memberForm');
const loading = document.getElementById('loading');
const message = document.getElementById('message');

function sanitize(str){
  if(!str) return '';
  return String(str).trim().replace(/[<>]/g,'');
}

function validateEmail(email){
  if(!email) return true; // optional
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showLoading(show){
  loading.style.display = show ? 'block' : 'none';
}

function showMessage(text, type='success'){
  message.textContent = text;
  message.className = 'message ' + (type === 'success' ? 'success' : 'error');
}

form.addEventListener('submit', async (e) =>{
  e.preventDefault();
  showMessage('');

  // Support either separate first/last fields or a single fullName input
  let firstName = '';
  let lastName = '';
  if(form.fullName && form.fullName.value.trim()){
    const parts = form.fullName.value.trim().split(/\s+/);
    firstName = sanitize(parts.shift() || '');
    lastName = sanitize(parts.join(' '));
  } else {
    firstName = sanitize((form.firstName && form.firstName.value) || '');
    lastName = sanitize((form.lastName && form.lastName.value) || '');
  }

  // Build birthday from small inputs if present, otherwise use single date input
  let birthday = '';
  const day = form['dob-day'] ? sanitize(form['dob-day'].value) : '';
  const month = form['dob-month'] ? sanitize(form['dob-month'].value) : '';
  const year = form['dob-year'] ? sanitize(form['dob-year'].value) : '';
  if(day || month || year){
    // prefer ISO format when possible
    const dd = day.padStart(2,'0');
    const mm = month.padStart(2,'0');
    if(year.length === 4){
      birthday = `${year}-${mm}-${dd}`;
    } else {
      birthday = `${dd}/${mm}/${year}`;
    }
  } else if(form.birthday){
    birthday = sanitize(form.birthday.value);
  }

  const data = {
    firstName,
    lastName,
    phone: sanitize(form.phone ? form.phone.value : ''),
    email: sanitize(form.email ? form.email.value : ''),
    address: sanitize(form.address ? form.address.value : ''),
    birthday: birthday,
    notes: sanitize(form.notes ? form.notes.value : ''),
    scout: {
      isMember: (function(){
        const r = form.querySelector('input[name="isScout"]:checked');
        return r ? (r.value === 'yes') : null;
      })(),
      ranks: Array.from(form.querySelectorAll('input[name="rank"]:checked')).map(i=>sanitize(i.value)),
      years: sanitize(form.scoutYears ? form.scoutYears.value : ''),
      activities: sanitize(form.scoutActivities ? form.scoutActivities.value : '')
    }
  };

  // Collect skills and hobbies
  data.skills = Array.from(form.querySelectorAll('input[name="skill"]:checked')).map(i=>sanitize(i.value));
  const otherSkill = form.querySelector('input[name="skillOther"]') ? sanitize(form.querySelector('input[name="skillOther"]').value) : '';
  if(otherSkill){ data.skills.push(otherSkill); }
  data.hobbies = sanitize(form.hobbies ? form.hobbies.value : '');

  // Collect scouting questions
  data.questions = {
    whyJoin: sanitize(form.q1 ? form.q1.value : ''),
    contribute: sanitize(form.q2 ? form.q2.value : ''),
    canCommit: (function(){ const r = form.querySelector('input[name="commit"]:checked'); return r ? r.value : ''; })(),
    otherInfo: sanitize(form.q4 ? form.q4.value : '')
  };

  // Collect agreement fields
  (function(){
    const aDay = form.agreeDay ? sanitize(form.agreeDay.value) : '';
    const aMonth = form.agreeMonth ? sanitize(form.agreeMonth.value) : '';
    const aYear = form.agreeYear ? sanitize(form.agreeYear.value) : '';
    let agreeDate = '';
    if(aDay || aMonth || aYear){
      const dd = aDay.padStart(2,'0');
      const mm = aMonth.padStart(2,'0');
      agreeDate = (aYear.length===4) ? `${aYear}-${mm}-${dd}` : `${dd}/${mm}/${aYear}`;
    }
    data.agreement = {
      name: sanitize(form.agreeName ? form.agreeName.value : ''),
      signature: sanitize(form.agreeSignature ? form.agreeSignature.value : ''),
      date: agreeDate
    };
  })();

  // Basic validation
  if(!data.firstName || !data.lastName){
    showMessage('Please enter full name (first and last).', 'error');
    return;
  }
  if(!validateEmail(data.email)){
    showMessage('Please enter a valid email address.', 'error');
    return;
  }

  // Prevent double submissions
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  showLoading(true);

  try{
    // Send as application/x-www-form-urlencoded to avoid CORS preflight
    const params = new URLSearchParams();
    params.append('payload', JSON.stringify(data));
    const resp = await fetch(GAS_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
      body: params
    });

    if(!resp.ok){
      throw new Error('Network response was not ok');
    }

    const result = await resp.json();
    if(result && (result.status === 'success' || result.result === 'success')){
      showMessage('Member saved successfully.', 'success');
      form.reset();
    } else {
      throw new Error(result && result.message ? result.message : 'Unknown error from server');
    }
  }catch(err){
    console.error(err);
    showMessage('Unable to save member. Please try again later.', 'error');
  }finally{
    submitBtn.disabled = false;
    showLoading(false);
  }
});
