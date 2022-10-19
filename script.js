const validateForm = formSelector => {
  const formElement = document.querySelector(formSelector);

  const validationOptions = [
    {
      attribute: 'minlength',
      isValid: input =>
        input.value &&
        input.value.length >= parseInt(input.minLength, 10),
      errorMessage: (input, label) =>
        `${label.textContent} needs to be at least ${input.minLength} characters`,
    },
    {
      attribute: 'custommaxlength',
      isValid: input =>
        input.value &&
        input.value.length <=
          parseInt(input.getAttribute('custommaxlength'), 10),
      errorMessage: (input, label) =>
        `${
          label.textContent
        } needs to be less than ${input.getAttribute(
          'custommaxlength'
        )} characters`,
    },
    {
      attribute: 'match',
      isValid: input => {
        const matchSelector = input.getAttribute('match');
        const matchedElement = formElement.querySelector(
          `#${matchSelector}`
        );
        return (
          matchedElement &&
          matchedElement.value.trim() === input.value.trim()
        );
      },
      errorMessage: (input, label) => {
        const matchSelector = input.getAttribute('match');
        const matchedElement = formElement.querySelector(
          `#${matchSelector}`
        );
        const matchedLabel =
          matchedElement.parentElement.parentElement.querySelector(
            'label'
          );

        return `${label.textContent} should match ${matchedLabel.textContent}`;
      },
    },
    {
      attribute: 'pattern',
      isValid: input => {
        const patternRegex = new RegExp(input.pattern);
        return patternRegex.test(input.value);
      },
      errorMessage: (input, label) =>
        `Not a valid ${label.textContent}`,
    },
    {
      attribute: 'required',
      isValid: input => {
        if (input.type === 'radio') {
          return input.checked;
        }
        return input.value.trim() !== '';
      },
      errorMessage: (input, label) =>
        `${label.textContent} is required`,
    },
  ];

  const validateSingleFormGroup = formGroup => {
    const label = formGroup.querySelector('label');
    const input = formGroup.querySelector('input, textarea');
    const errorContainer = formGroup.querySelector('.error');
    const errorIcon = formGroup.querySelector('.error-icon');
    const successIcon = formGroup.querySelector('.success-icon');

    let formGroupError = false;
    for (const option of validationOptions) {
      if (input.hasAttribute(option.attribute)) {
        console.log(label.textContent, option.isValid(input));
      }
      if (
        input.hasAttribute(option.attribute) &&
        !option.isValid(input)
      ) {
        errorContainer.textContent = option.errorMessage(
          input,
          label
        );
        input.classList.add('border-red-700');
        input.classList.remove('border-green-700');
        successIcon.classList.add('hidden');
        errorIcon.classList.remove('hidden');
        formGroupError = true;
      }
    }

    if (!formGroupError) {
      errorContainer.textContent = '';
      input.classList.add('border-green-700');
      input.classList.remove('border-red-700');
      successIcon.classList.remove('hidden');
      errorIcon.classList.add('hidden');
    }
  };

  formElement.setAttribute('novalidate', '');

  Array.from(formElement.elements).forEach(element => {
    element.addEventListener('blur', event => {
      validateSingleFormGroup(
        event.srcElement.parentElement.parentElement
      );
    });
  });

  const validateAllFormGroups = formToValidate => {
    const formGroups = Array.from(
      formToValidate.querySelectorAll('.formGroup')
    );

    formGroups.forEach(formGroup => {
      validateSingleFormGroup(formGroup);
    });

    console.log(
      Array.from(
        document.getElementById('registrationForm').elements
      ).map(element => element.checked)
    );
  };

  formElement.addEventListener('submit', event => {
    event.preventDefault();
    validateAllFormGroups(formElement);
  });
};

validateForm('#registrationForm');
