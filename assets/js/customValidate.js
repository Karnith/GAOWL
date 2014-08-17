$(document).ready(function() {
  $('#sign-up-form').bootstrapValidator({
      excluded: [':disabled', ':hidden', ':not(:visible)'],
      feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
      },
      live: 'enabled',
      message: 'This value is not valid',
      submitButtons: 'input[type="submit"]',
      fields: {
          name: {
              message: 'The username is not valid',
              validators: {
                  notEmpty: {
                      message: 'The username is required and cannot be empty'
                  },
                  stringLength: {
                      min: 6,
                      max: 30,
                      message: 'The username must be more than 6 and less than 30 characters long'
                  },
                  regexp: {
                      regexp: /^[a-zA-Z0-9_]+$/,
                      message: 'The username can only consist of alphabetical, number and underscore'
                  }
              }
          },
          email: {
              validators: {
                  notEmpty: {
                      message: 'The email is required and cannot be empty'
                  },
                  emailAddress: {
                      message: 'The input is not a valid email address'
                  }
              }
          },
          password: {
              message: 'The password is not valid',
              validators: {
                  notEmpty: {
                      message: 'The password is required and cannot be empty'
                  },
                  different: {
                      field: 'name',
                      message: 'The password cannot be the same as username'
                  },
                  identical: {
                      field: 'confirmation',
                      message: 'The password and its confirm are not the same'
                  },
                  stringLength: {
                      min: 6,
                      max: 20,
                      message: 'The password must be 6 to 20 characters long'
                  },
                  regexp: {
                      regexp: /^[a-zA-Z0-9_]+$/,
                      message: 'The username can only consist of alphabetical, number and underscore'
                  }
              }
          },
          confirmation: {
              message: 'The password is not valid',
              validators: {
                  notEmpty: {
                      message: 'The password is required and cannot be empty'
                  },
                  identical: {
                      field: 'password',
                      message: 'The password and its confirm are not the same'
                  },
                  stringLength: {
                      min: 6,
                      max: 20,
                      message: 'The password must be 6 to 20 characters long'
                  },
                  regexp: {
                      regexp: /^[a-zA-Z0-9_]+$/,
                      message: 'The username can only consist of alphabetical, number and underscore'
                  }
              }
          }
      }
  });
});