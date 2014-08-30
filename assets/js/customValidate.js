$(document).ready(function() {
    $('#sign-up-form, #user-edit-form, #user-password-form, #form-signin').bootstrapValidator({
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
              enabled: false,
              message: 'The username is not valid',
              validators: {
                  notEmpty: {
                      message: 'The username is required and cannot be empty'
                  },
                  remote: {
                      url: '/user/validation?', // route for field validation
                      data: function(validator) {
                          return {
                              name: validator.getFieldElements('name').val(), // field to [post] to validation route
                              _csrf: validator.getFieldElements('_csrf').val() // field to [post] csrf for route access
                          };
                      },
                      message: 'The username is not available'
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
              enabled: false,
              validators: {
                  notEmpty: {
                      message: 'The email is required and cannot be empty'
                  },
                  emailAddress: {
                      message: 'The input is not a valid email address'
                  },
                  remote: {
                      url: '/user/validation?', // route for field validation
                      data: function(validator) {
                          return {
                              name: validator.getFieldElements('email').val(), // field to [post] to validation route
                              _csrf: validator.getFieldElements('_csrf').val() // field to [post] csrf for route access
                          };
                      },
                      message: 'The email is not available'
                  }
              }
          },
          password: {
              enabled: false,
              message: 'The password is not valid',
              validators: {
                  notEmpty: {
                      message: 'The password is required and cannot be empty'
                  },
                  different: {
                      field: 'name',
                      message: 'The password cannot be the same as username'
                  },
                  stringLength: {
                      min: 8,
                      max: 20,
                      message: 'The password must be at least 8 characters long'
                  },
                  identical: {
                      field: 'confirmation',
                      message: 'The password and its confirm are not the same'
                  },
                  regexp: {
                      regexp: /^[a-zA-Z0-9_!@#$%&*]+$/,
                      message: 'The password can only consist of alphabetical, number and _!@#$%&*'
                  }
              }
          },
          confirmation: {
              enabled: false,
              message: 'The password is not valid',
              validators: {
                  notEmpty: {
                      message: 'The password is required and cannot be empty'
                  },
                  stringLength: {
                      min: 8,
                      max: 20,
                      message: 'The password must be at least 8 characters long'
                  },
                  identical: {
                      field: 'password',
                      message: 'The password and its confirm are not the same'
                  },
                  regexp: {
                      regexp: /^[a-zA-Z0-9_!@#$%&*]+$/,
                      message: 'The password can only consist of alphabetical, number and _!@#$%&*'
                  }
              }
          }
      }
    })
    .on('keydown', '.vNField', function() {
        $('#user-edit-form, #user-password-form')
            .bootstrapValidator('enableFieldValidators', 'name');
    })
    .on('keydown', '.vEField', function() {
        $('#user-edit-form, #user-password-form')
            .bootstrapValidator('enableFieldValidators', 'email');
    })
    .on('keyup', /*'[name="password"]'*/'.vField', function() {
        var isEmpty = $(this).val() == '',
            forms = $('#sign-up-form, #user-edit-form, #user-password-form, #form-signin'),
            signUp = $('#sign-up-form');
        forms
            .bootstrapValidator('enableFieldValidators', 'password', !isEmpty)
            /*.bootstrapValidator('enableFieldValidators', 'confirmation', !isEmpty)*/;
        signUp
            .bootstrapValidator('enableFieldValidators', 'name', !isEmpty)
            .bootstrapValidator('enableFieldValidators', 'email', !isEmpty);

            // Revalidate the field when user start typing in the password field
        if ($(this).val().length == 1) {
            forms
                .bootstrapValidator('validateField', 'password')
                /*.bootstrapValidator('validateField', 'confirmation')*/;
            signUp
                .bootstrapValidator('validateField', 'name')
                .bootstrapValidator('validateField', 'email');

        }
    });
    function showAlert() {
        $("#svrResponse").load(function () {
            var serverResponse = $("#svrResponse").contents().find("pre").text();
            console.log('this is the response: '+serverResponse);
            if (serverResponse == '200') {
                $("#reset").show();
            }
        });
    }
    showAlert();
    $(function() {
        $('#password')
            .password()
            /*.on('show.bs.password', function(e) {
                $('#eventLog').text('On show event');
                $('#methods').prop('checked', true);
            })
            .on('hide.bs.password', function(e) {
                $('#eventLog').text('On hide event');
                $('#methods').prop('checked', false);
            });
        $('#methods').click(function() {
            $('#password').password('toggle');
        })*/;
    });
});