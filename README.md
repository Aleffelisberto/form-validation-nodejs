# Form validation

### Modules

- [x] express-session

- [x] connect-flash

- [x] body-parser

- [x] express-session

- [x] cookie-parser

- [x] validatorjs

- [x] express

- [x] ejs

### Example of how to check forms

```js
app.get('/', (req, res) => {
  let emailError = req.flash('emailError')
  let nameError = req.flash('nameError')
  let pointsError = req.flash('pointsError')

  if (emailError === undefined || emailError.length === 0) {
    emailError = undefined
  } else {
    emailError = emailError[0]
  }
  if (!nameError || nameError.length === 0) nameError = undefined
  if (!pointsError || pointsError.length === 0) pointsError = undefined

  res.render('index', { emailError: emailError, nameError, pointsError })
})

function checkFormErrors(req, email, name, points) {
  let isSomeError = false

  if (!validator.isEmail(email)) {
    req.flash('emailError', 'It is not an email!')
    isSomeError = true
  }
  if (!validator.isAscii(name) || validator.isEmpty(name)) {
    req.flash('nameError', 'Names contains just letters!')
    isSomeError = true
  }
  if (!validator.isNumeric(points) || validator.isEmpty(points)) {
    req.flash('pointsError', 'Just numbers please!')
    isSomeError = true
  }

  return isSomeError
}

app.post('/form', (req, res) => {
  const { email, name, points } = req.body

  let isSomeError = checkFormErrors(req, email, name, points)

  if (!isSomeError) res.send('Good my boy, good!')
  else res.redirect('/')
})
```
