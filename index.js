const express = require('express')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const validator = require('validator')

const app = express()

const PORT = 3000

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser('hackthissitemothafocka'))
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 /* 1hour */ }
  })
)
app.use(flash())

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

app.listen(PORT, err => {
  if (err) console.error(err)
  else console.log('server running...')
})
