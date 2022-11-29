class Me {
   constructor(type) {
      this.typeMedia = type
   }
   init() {
      this.elements = document.querySelectorAll('[data-me]')
      this.objects = []

      if (this.elements.length > 0) {
         for (let index = 0; index < this.elements.length; index++) {
            const meElement = this.elements[index];

            const obj = {}
            obj.el = meElement
            const dataAttr = meElement.dataset.me.split(',').map(item => item.trim())
            obj.dataAttr = {
               size: dataAttr[0],
               block: dataAttr[1],
               index: dataAttr[2],
            }
            obj.parentElement = obj.el.parentElement
            obj.indexParent = Array.from(obj.parentElement.children).indexOf(obj.el)
            this.objects.push(obj)
         }
         for (let index = 0; index < this.objects.length; index++) {
            const obj = this.objects[index];
            const mediaQueryList = window.matchMedia(`(${this.typeMedia}-width:${obj.dataAttr.size}px)`)
            this.mediaHandler(mediaQueryList, obj)
            mediaQueryList.addEventListener('change', e => this.mediaHandler(e, obj))
         }
      }
   }
   mediaHandler(e, obj) {
      if (e.matches) {
         obj.el.classList.add('-me')
         this.moveTo(obj.el, obj.dataAttr.block, obj.dataAttr.index)
      } else {
         obj.el.classList.remove('-me')
         this.moveBack(obj.el, obj.parentElement, obj.indexParent)
      }
   }
   moveTo(element, block, index) {
      if (document.querySelector(block)) {
         const toBlock = document.querySelector(block)
         const blockChildren = toBlock.children
         const indexBlock = index == 'first' ? 0 :
            index == 'last' ? undefined :
               index;

         if (blockChildren[indexBlock] != undefined) {
            blockChildren[indexBlock].insertAdjacentElement(
               'beforebegin',
               element
            )
         } else {
            toBlock.insertAdjacentElement(
               'beforeend',
               element
            )
         }
      }
   }
   moveBack(element, parentElement, index) {
      const blockChildren = parentElement.children

      if (blockChildren[index] != undefined) {
         blockChildren[index].insertAdjacentElement(
            'beforebegin',
            element
         )
      } else {
         parentElement.insertAdjacentElement(
            'beforeend',
            element
         )
      }
   }
}
const me = new Me('max')
me.init()
class Popup {
   init() {
      this.elements = document.querySelectorAll('[data-popup-link]')
      this.objects = []
      if (this.elements.length > 0) {
         document.addEventListener('click', e => this.actionPopupDocument(e, this))
      }
   }
   actionPopupDocument(e, thisClass) {
      const target = e.target
      const animPopup = document.querySelectorAll('[data-popup].-anim')

      if (target.closest('[data-popup-link]')) {
         e.preventDefault()

         if (animPopup.length === 0) {
            const popupLink = target.closest('[data-popup-link]')

            const openPopups = document.querySelectorAll('[data-popup].-open')
            openPopups.forEach(element => element.classList.remove('-open'))

            const burgerIcon = document.querySelector('.header__burger')
            document.querySelector('.menu').classList.remove('-open')
            document.body.classList.remove('-lock')
            addPadding(false)

            if (document.querySelector(`${popupLink.dataset.popupLink}`)) {
               const popupBlock = document.querySelector(`${popupLink.dataset.popupLink}`)
               if (openPopups.length > 0) {
                  thisClass.openPopup(popupBlock, false)
               } else {
                  thisClass.openPopup(popupBlock)
               }
            }
         }
      }
      if (target.closest('[data-popup-close]')) {
         e.preventDefault()
         if (animPopup.length === 0) {
            const popupClose = target.closest('[data-popup-close]')
            const popupBlock = popupClose.closest('[data-popup]')
            thisClass.closePopup(popupBlock)
         }
      }
      if (target.closest('[data-popup]') && !target.closest('[data-popup-content]')) {
         if (animPopup.length === 0) {
            const popupBlock = target.closest('[data-popup]')
            thisClass.closePopup(popupBlock)
         }
      }
   }
   openPopup(el, anim = true) {
      el.classList.add('-open')
      el.classList.add('-anim')
      setTimeout(() => {
         el.classList.remove('-anim')
      }, 400)
      if (anim) {
         addPadding(true)
         document.body.classList.add('-lock-popup')
      }
   }
   closePopup(el) {
      el.classList.add('-anim')
      el.classList.remove('-open')
      setTimeout(() => {
         addPadding(false)
         document.body.classList.remove('-lock-popup')
         el.classList.remove('-anim')
      }, 400)
   }
}
const popup = new Popup()
popup.init()
let slideUp = (target, duration = 400) => {
   if (!target.classList.contains('-anim')) {
      target.classList.add('-anim');
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
         target.hidden = true;
         target.style.removeProperty('height');
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-top');
         target.style.removeProperty('margin-bottom');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('-anim');
      }, duration)
   }
}
let slideDown = (target, duration = 400) => {
   if (!target.classList.contains('-anim')) {
      target.classList.add('-anim');
      if (target.hidden) {
         target.hidden = false;
      }
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(() => {
         target.style.removeProperty('height');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('-anim');
      }, duration)
   }
}
let slideToggle = (target, duration = 400) => {
   if (target.hidden) {
      return slideDown(target, duration);
   } else {
      return slideUp(target, duration);
   }
}
class ValidateForm {
   constructor(form, objUser) {
      this.form = form
      this.objUser = objUser
      form.addEventListener('submit', e => this.formSend(e, this, form, objUser))
   }
   async formSend(e, thisClass, form, objUser) {
      e.preventDefault()
      const error = thisClass.validateForm(form, objUser)

      if (error === 0) {
         form.classList.add('-sending')
         const formData = new FormData(form)

         const response = await fetch(objUser.url, {
            method: objUser.method,
            // body: formData
         })
         if (response.ok) {
            // const result = await response.json();
            console.log('result');
         } else {
            console.log('Error');
         }

         form.reset()
         if (objUser.items.input && objUser.items.input.length > 0) {
            objUser.items.input.forEach(input => {
               input.blur()
            })
         }
         if (form.querySelectorAll('.-custom-select')) {
            const customSelect = form.querySelectorAll('.-custom-select')
            customSelect.forEach(select => select.reset())
         }
         form.classList.remove('-sending')
      } else {
         console.log('Emptly');
      }
   }
   validateForm(form, objUser) {
      let error = 0;
      for (const prop in objUser.items) {
         const elements = objUser.items[prop]

         if (prop == 'input') {
            if (elements.length > 0) {
               elements.forEach(input => {
                  this.removeError(input)

                  if (input.classList.contains('-tel')) {
                     if (this.telTest(input)) {
                        this.addError(input)
                        error++
                     }
                  } else if (input.classList.contains('-email')) {
                     if (this.emailTest(input)) {
                        this.addError(input)
                        error++
                     }
                  } else if (input.classList.contains('-password')) {
                     if (input.value.length < 8 || input.value.length > 10) {
                        this.addError(input)
                        error++
                        if (input.value.length < 8) {
                           console.log('passswod 8');
                        }
                        if (input.value.length > 10) {
                           console.log('passswod 10');
                        }
                     }
                  } else {
                     if (!input.value) {
                        this.addError(input)
                        error++
                     }
                  }
               })
            }
         }
         if (prop == 'checkbox') {
            if (elements.length > 0) {
               elements.forEach(checkbox => {
                  this.removeError(checkbox)
                  if (!checkbox.checked) {
                     this.addError(checkbox)
                     error++
                  }
               })
            }
         }
         if (prop == 'radio') {
            if (elements.length > 0) {
               const groupsRadio = {}
               elements.forEach(radio => {
                  if (!groupsRadio[radio.name]) {
                     groupsRadio[radio.name] = []
                  }
                  groupsRadio[radio.name].push(radio)
               })
               for (const prop in groupsRadio) {
                  const groupRadio = groupsRadio[prop]
                  const checkedRadio = Array.from(groupRadio).filter(radio => radio.checked)[0]

                  groupRadio.forEach(radio => {
                     this.removeError(radio)
                  })
                  if (!checkedRadio) {
                     groupRadio.forEach(radio => {
                        this.addError(radio)
                        error++
                     })
                  }
               }
            }
         }
         if (prop == 'select') {
            if (elements.length > 0) {
               elements.forEach(select => {
                  select.classList.remove('-error')
                  if (select.classList.contains('-custom-select-no-choose')) {
                     select.classList.add('-error')
                     error++
                  }
               })
            }
         }
      }
      return error;
   }
   removeError(input) {
      input.parentElement.classList.remove('-error')
      input.classList.remove('-error')
      const form = input.closest('form')
      if (form.classList.contains('-error')) {
         form.classList.remove('-error')
      }
   }
   addError(input) {
      input.parentElement.classList.add('-error')
      input.classList.add('-error')
      const form = input.closest('form')
      if (!form.classList.contains('-error')) {
         form.classList.add('-error')
      }
   }
   emailTest(input) {
      return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
   }
   telTest(input) {
      return !/^((8|\+7)[\- ]?)?(\(?\d{3,4}\)?[\- ]?)?[\d\- ]{5,10}$/.test(input.value);
   }
}

const inputsValue = document.querySelectorAll('[data-value]')
if (inputsValue.length > 0) {
   inputsValue.forEach(input => {
      const placeholderValue = input.dataset.value;

      if (!input.value) {
         input.placeholder = placeholderValue
      }

      input.addEventListener('focus', () => {
         input.placeholder = ''
      })
      input.addEventListener('blur', () => {
         input.placeholder = placeholderValue
      })
   })
}
function animateMarquee(el, duration) {
	const innerEl = el.querySelector('[data-marquee-inner]');
	const innerWidth = innerEl.offsetWidth;
	const cloneEl = innerEl.cloneNode(true);
	el.appendChild(cloneEl);

	let start = performance.now();
	let progress;
	let translateX;

	requestAnimationFrame(function step(now) {
		progress = (now - start) / duration;

		if (progress > 1) {
			progress %= 1;
			start = now;
		}

		translateX = innerWidth * progress;
		innerEl.style.transform = `translate3d(${translateX}px, 0, 0)`;
		cloneEl.style.transform = `translate3d(${translateX}px, 0, 0)`;
		requestAnimationFrame(step);
	});
}

const marqueeElemnets = document.querySelectorAll('[data-marquee]')
if (marqueeElemnets.length > 0) {
	marqueeElemnets.forEach(marquee => {
		const speed = marquee.dataset.marquee
		animateMarquee(marquee, speed);
	})
}

	const isMobile = {
		Android: function () { return navigator.userAgent.match(/Android/i); },
		BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
		iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
		Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
		Windows: function () { return navigator.userAgent.match(/IEMobile/i); },
		any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
	};

document.addEventListener('click', actionDocument)
function actionDocument(e) {
	const target = e.target;
	if (target.closest('.header__burger')) {
		e.preventDefault()
		document.querySelector('.menu').classList.add('-open')

		addPadding(true)
		document.body.classList.add('-lock')
	}
	if (target.closest('.menu') && !target.closest('.menu__body') || target.closest('.menu__close')) {
		e.preventDefault()
		target.closest('.menu').classList.remove('-open')
		document.body.classList.remove('-lock')
		addPadding(false)
	}
	if (target.closest('.arrow-top')) {
		e.preventDefault()
		const elArrowTop = target.closest('.arrow-top')
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	}
}
function addPadding(type) {
	const widthScrollbar = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px'
	const elementsPadding = document.querySelectorAll('.-add-padding-fixed')
	const elementsMargin = document.querySelectorAll('.-add-margin-fixed')

	if (type) {
		elementsPadding.forEach(el => el.style.paddingRight = widthScrollbar)
		elementsMargin.forEach(el => el.style.marginRight = widthScrollbar)
	} else {
		elementsPadding.forEach(el => el.style.paddingRight = '')
		elementsMargin.forEach(el => el.style.marginRight = '')
	}
}

const arrowTop = document.querySelector('.arrow-top')
if (arrowTop) {
	document.addEventListener('scroll', handlerArrowTop)
	window.addEventListener('resize', handlerArrowTop)
	function handlerArrowTop() {
		if (scrollY > window.innerHeight) {
			arrowTop.classList.remove('-hide')
			arrowTop.classList.add('-show')
		} else {
			arrowTop.classList.remove('-show')
			arrowTop.classList.add('-hide')
		}
	}
	handlerArrowTop()
}

SmoothScroll({
	animationTime: 500,
	stepSize: 100,
	accelerationDelta: 30,
	accelerationMax: 2,
	keyboardSupport: true,
	arrowScroll: 50,
	pulseAlgorithm: true,
	pulseScale: 4,
	pulseNormalize: 1,
	touchpadSupport: true,
})

var phoneInputs = document.querySelectorAll('.phone-input-form-request__input:not(.-input-phone-only) input');
if (phoneInputs.length > 0) {
	phoneInputs.forEach(phoneInput => {
		phoneInput.phoneInputMask = IMask(phoneInput, {
			mask: '+7(000)000-00-00',
			lazy: true,
			placeholderChar: '0'
		});
	})
}
var phoneInputOnly = document.querySelectorAll('.phone-input-form-request__input.-input-phone-only input');
if (phoneInputOnly.length > 0) {
	phoneInputOnly.forEach(phoneInput => {
		phoneInput.phoneInputMask = IMask(phoneInput, {
			mask: '+7(000)000-00-00',
			lazy: true,
			placeholderChar: '0'
		});
	})
}

class CustomSelect {
   init() {
      this.elements = document.querySelectorAll('[data-custom-select]')
      this.objects = []
      if (this.elements.length > 0) {
         for (let index = 0; index < this.elements.length; index++) {
            const select = this.elements[index];

            const obj = {}
            obj.select = select
            obj.options = obj.select.options
            obj.selectedIndex = obj.select.selectedIndex
            obj.className = obj.select.classList[0]
            obj.mLabel = obj.select.hasAttribute('data-custom-select-mlabel') ? obj.select.dataset.customSelectMlabel : false
            obj.label = obj.select.hasAttribute('data-custom-select-label') ? obj.select.dataset.customSelectLabel : false
            obj.selectPhone = obj.select.hasAttribute('data-custom-select-phone') ? true : false

            this.objects.push(obj)
         }
         for (let index = 0; index < this.objects.length; index++) {
            const obj = this.objects[index];
            obj.select.className = ''
            obj.select.style.display = 'none'
            this.createStructure(obj.select, obj.options, obj.className, obj.mLabel, obj.label, obj.selectPhone)

            obj.customSelect = {}
            obj.customSelect.select = obj.select.nextElementSibling
            obj.customSelect.openner = obj.customSelect.select.querySelector('.-custom-select__openner')
            obj.customSelect.value = obj.customSelect.select.querySelector('.-custom-select__value')
            obj.customSelect.flag = obj.customSelect.select.querySelector('.-custom-select__flag')
            obj.customSelect.icon = obj.customSelect.select.querySelector('.-custom-select__icon')
            obj.customSelect.body = obj.customSelect.select.querySelector('.-custom-select__body')
            obj.customSelect.items = obj.customSelect.select.querySelectorAll('.-custom-select__item')
            this.fillContent(obj)

            const customSelect = obj.customSelect

            if (!obj.label) {
               customSelect.items[obj.select.selectedIndex].classList.add('-active')
            } else {
               customSelect.select.classList.add('-custom-select-no-choose')
            }

            slideUp(customSelect.body, 0)
            customSelect.select.addEventListener('click', e => this.actionCustomSelect(e, obj.label, obj.select, obj.options, obj.selectPhone))
            document.addEventListener('click', this.actionDocument)

            const thisClass = this
            customSelect.select.reset = function () {
               const activeItem = customSelect.items[obj.selectedIndex]
               thisClass.activeOption(activeItem, obj.select, obj.options, customSelect.select, selectPhone, obj.label)
            }
         }
      }
   }
   createStructure(select, options, className, mLabel, label, selectPhone) {
      const templateWrapStart = `<div class="${className} -custom-select">`
      const templateWrapEnd = `</div>`

      const templateOpennerStart = `<a href="" class="${className}__openner -custom-select__openner">`
      const templateOpennerEnd = `</a>`
      const templateValue = `<div class="${className}__value -custom-select__value">${label ? label : ''}</div>`
      const templateIcon = `<div class="${className}__icon -custom-select__icon"></div>`

      const templateMlable = mLabel ? `<div class="${className}__mlabel -custom-select__mlabel">${mLabel}</div>` : ''
      let templateOpenner
      if (selectPhone) {
         const templateFlag = `<div class="${className}__flag -custom-select__flag"></div>`
         templateOpenner = templateOpennerStart + templateFlag + templateIcon + templateValue + templateOpennerEnd
      } else {
         templateOpenner = templateOpennerStart + templateMlable + templateValue + templateIcon + templateOpennerEnd
      }

      const templateBodyStart = `<div class="${className}__body -custom-select__body">`
      const templateBodyEnd = `</div>`
      let templateItems = ''
      for (let index = 0; index < options.length; index++) {
         const templateItem = `<div class="${className}__item -custom-select__item"></div>`
         templateItems += templateItem
      }
      const templateBody = templateBodyStart + templateItems + templateBodyEnd
      const templateCustomSelect = templateWrapStart + templateOpenner + templateBody + templateWrapEnd
      select.insertAdjacentHTML(
         'afterend',
         templateCustomSelect
      )
   }
   fillContent(obj) {
      const selectedOption = obj.options[obj.select.selectedIndex]
      if (!obj.label) {
         if (obj.select) {
            const attrData = Array.from(selectedOption.dataset.label.split(',')).map(item => item.trim())
            obj.customSelect.value.innerHTML = attrData[1]
            obj.customSelect.flag.innerHTML = `<img src="${attrData[2]}" alt="">`
         } else {
            obj.customSelect.value.innerHTML = selectedOption.innerHTML

         }
      }

      const contentOptions = Array.from(obj.options).map(item => {
         if (obj.selectPhone) {
            const attrData = Array.from(item.dataset.label.split(',')).map(item => item.trim())
            return `<div class="phone-input-select__name">${attrData[0]}</div><div class="phone-input-select__code">${attrData[1]}</div><div class="phone-input-select__flag"><img src="${attrData[2]}" alt=""></div>`
         } else {
            return item.innerHTML
         }
      })
      obj.customSelect.items.forEach((item, index) => {
         item.innerHTML = contentOptions[index]
      })
   }
   actionCustomSelect(e, label, select, options, selectPhone) {
      const target = e.target
      const customSelect = e.currentTarget
      const customSelectValue = customSelect.querySelector('.-custom-select__value')
      const customSelectBody = customSelect.querySelector('.-custom-select__body')
      const customSelectItems = customSelect.querySelectorAll('.-custom-select__item')

      if (target.closest('.-custom-select__item')) {
         if (!document.querySelector('.-custom-select__body.-anim')) {
            if (label && customSelect.classList.contains('-custom-select-no-choose')) {
               customSelect.classList.remove('-custom-select-no-choose')
            }
            if (!target.classList.contains('-active')) {
               this.activeOption(target, select, options, customSelect, selectPhone)
            }
            customSelect.classList.remove('-open')
            slideUp(customSelectBody)
         }
      }
      if (target.closest('.-custom-select__openner')) {
         e.preventDefault()

         if (!document.querySelector('.-custom-select__body.-anim')) {
            const openner = target.closest('.-custom-select__openner')
            if (document.querySelector('.-custom-select.-open')) {
               const openCustomSelect = document.querySelector('.-custom-select.-open')

               if (openCustomSelect != customSelect) {
                  const customSelectBody = openCustomSelect.querySelector('.-custom-select__body')
                  slideUp(customSelectBody)
                  openCustomSelect.classList.remove('-open')
               }
            }

            if (!customSelect.classList.contains('-open')) {
               openner.vars = [this, select, options, customSelect, customSelectValue, customSelectBody, customSelectItems, label, selectPhone]
               openner.addEventListener('keydown', this.keydownOpenner)
               document.addEventListener('keydown', this.keydownDocument)
               openner.addEventListener('blur', this.blurOpenner)
            } else {
               openner.vars = []
               openner.removeEventListener('blur', this.blurOpenner)
               openner.removeEventListener('keydown', this.keydownOpenner)
               document.removeEventListener('keydown', this.keydownDocument)
            }

            customSelect.classList.toggle('-open')
            slideToggle(customSelectBody)
         }
      }
   }
   blurOpenner(e) {
      if (!document.querySelector('.-custom-select__body.-anim')) {
         const openner = e.target
         const thisClass = openner.vars[0]
         const customSelect = openner.vars[3]
         const customSelectBody = openner.vars[5]
         if (openner.eventKey == 'Tab') {
            customSelect.classList.remove('-open')
            slideUp(customSelectBody)
            openner.eventKey = undefined
         }

         openner.removeEventListener('blur', thisClass.blurOpenner)
         openner.removeEventListener('keydown', thisClass.keydownOpenner)
         document.removeEventListener('keydown', thisClass.keydownDocument)
      }

   }
   keydownDocument(e) {
      if (e.code == 'ArrowUp' || e.code == 'ArrowDown') {
         e.preventDefault()
      }
   }
   keydownOpenner(e) {
      const openner = e.target
      const thisClass = openner.vars[0]
      const select = openner.vars[1]
      const options = openner.vars[2]
      const customSelect = openner.vars[3]
      const customSelectValue = customSelect.querySelector('.-custom-select__value')
      const customSelectBody = customSelect.querySelector('.-custom-select__body')
      const customSelectItems = customSelect.querySelectorAll('.-custom-select__item')
      const label = openner.vars[7]
      const selectPhone = openner.vars[8]

      openner.eventKey = e.code

      if (e.code == 'Tab' && document.querySelector('.-custom-select__body.-anim')) {
         e.preventDefault()
      }

      if (!document.querySelector('.-custom-select__body.-anim')) {
         if (e.code == 'Escape') {
            customSelect.classList.remove('-open')
            slideUp(customSelectBody)
         }
         if (e.code == 'ArrowUp' || e.code == 'ArrowDown') {
            let activeItem = customSelect.querySelector('.-custom-select__item.-active')

            if (!activeItem) {
               activeItem = customSelectItems[0]
               thisClass.activeOption(activeItem, select, options, customSelect, selectPhone)

               if (label && customSelect.classList.contains('-custom-select-no-choose')) {
                  customSelect.classList.remove('-custom-select-no-choose')
               }

               return false;
            }
            if (e.code == 'ArrowUp' && activeItem.previousElementSibling) {
               thisClass.activeOption(activeItem.previousElementSibling, select, options, customSelect, selectPhone)
            }
            if (e.code == 'ArrowDown' && activeItem.nextElementSibling) {
               thisClass.activeOption(activeItem.nextElementSibling, select, options, customSelect, selectPhone)
            }
         }
      }
   }
   activeOption(item, select, options, customSelect, selectPhone, label = null) {
      const customSelectOpenner = customSelect.querySelector('.-custom-select__openner')
      const customSelectValue = customSelect.querySelector('.-custom-select__value')
      const customSelectFlag = customSelect.querySelector('.-custom-select__flag')
      const customSelectItems = customSelect.querySelectorAll('.-custom-select__item')

      if (selectPhone) {
         item = item.closest('.-custom-select__item')
      }

      customSelectItems.forEach(item => item.classList.remove('-active'))
      select.selectedIndex = Array.from(customSelectItems).indexOf(item)
      if (!label) {
         const selectedIndex = select.selectedIndex
         customSelectItems[selectedIndex].classList.add('-active')

         if (selectPhone) {
            const attrData = Array.from(options[selectedIndex].dataset.label.split(',')).map(item => item.trim())
            customSelectValue.innerHTML = attrData[1]
            customSelectFlag.innerHTML = `<img src="${attrData[2]}" alt="">`

            const phoneInput = item.closest('.input-form-request').querySelector('.-input-form input')

            if (Array.from(phoneInputs).includes(phoneInput)) {
               const phoneInputMask = phoneInput.phoneInputMask
               const value = phoneInput.value

               phoneInputMask.updateOptions({
                  mask: attrData[3],
               });

               phoneInput.setAttribute('data-value', attrData[3])
               phoneInput.setAttribute('placeholder', attrData[3])
               phoneInputMask.value = phoneInputMask.unmaskedValue
            }



         } else {
            customSelectValue.innerHTML = options[selectedIndex].innerHTML
         }
      } else {
         customSelectValue.innerHTML = label
         const customSelect = customSelectValue.closest('.-custom-select')
         customSelect.classList.add('-custom-select-no-choose')
      }
   }
   actionDocument(e) {
      const target = e.target
      if (!target.closest('.-custom-select')) {
         if (document.querySelector('.-custom-select.-open')) {
            if (!document.querySelector('.-custom-select__body.-anim')) {
               const activeCustomSelect = document.querySelector('.-custom-select.-open')
               const customSelectBody = activeCustomSelect.querySelector('.-custom-select__body')

               activeCustomSelect.classList.remove('-open')
               slideUp(customSelectBody)
            }
         }
      }
   }
}
const customSelect = new CustomSelect()
customSelect.init()

	const fixedScroll = document.querySelector('.-fixed-scroll')
if (fixedScroll) {
	window.addEventListener('scroll', scrollFixed)
	function scrollFixed() {
		const parentElement = fixedScroll.parentElement
		const dataAttr = fixedScroll.dataset.fixedStart
		const pointStart = parentElement.getBoundingClientRect().top + scrollY - +dataAttr
		const pointStop = parentElement.offsetHeight - fixedScroll.offsetHeight + pointStart

		if (!isMobile.any()) {
			if (scrollY > pointStart) {
				if (scrollY > pointStop) {
					fixedScroll.style.cssText = `width:${parentElement.offsetWidth}px;top:${+getComputedStyle(fixedScroll).paddingTop.replace('px', '') - (scrollY - (pointStop + +dataAttr))}px;`

				} else {
					if (!fixedScroll.classList.contains('-f')) {
						fixedScroll.classList.add('-f')
						fixedScroll.style.cssText = `width:${parentElement.offsetWidth}px;top:${dataAttr}px;`
					}
				}
			} else {
				if (fixedScroll.classList.contains('-f')) {
					fixedScroll.classList.remove('-f')
					fixedScroll.style.cssText = ''
				}
			}
		} else {
			fixedScroll.classList.remove('-f')
			fixedScroll.style.cssText = ''

		}
	}
	scrollFixed()
}