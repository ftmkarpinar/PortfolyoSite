document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const fd = new FormData(form);
    const name = (fd.get('name') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const message = (fd.get('message') || '').toString().trim();

    if (!name || !email || !message) {
      const note = document.querySelector('.form-note');
      if (note) note.textContent = 'Lütfen tüm alanları doldurun.';
      return;
    }

    const subject = encodeURIComponent(`Yeni iletişim: ${name}`);
    const bodyLines = [
      `İsim: ${name}`,
      `E-posta: ${email}`,
      '',
      'Mesaj:',
      message
    ];
    const body = encodeURIComponent(bodyLines.join('\n\n'));

    const to = 'fatma.softeng@gmail.com';
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
});