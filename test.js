const firstName = document.getElementById('firstName');
const email = document.getElementById('email');

if (firstName.value === '') {
  errors.push('First name is required');
}

if (firstName.value.length < 10) {
  errors.push('First name must be at least 10 characters');
}
