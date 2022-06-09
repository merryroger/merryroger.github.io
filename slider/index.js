let settings = {
  mode: 'switch',
  //mode: 'wipe',
  //mode: 'rollup',
  //mode: 'meltdown',
  //mode: 'fog',
  defaultItem: 0,
  items: [
    "/images/slide-1.jpg",
    "/images/slide-2.jpg",
    "/images/slide-3.jpg",
    "/images/slide-4.jpg",
    "/images/slide-5.jpg",
  ],
  dock: '.slider',
  dockClassName: (x) => { return `slider slide-${x}` },
  auto: true,
  playDirection: 'right', /* right, left, top, bottom are acceptable */
  loop: true,
  msSwapDelay: 2000,
  msSwapDuration: 800,
  controlClass: '.slider-button',
  wheelClass: '.slider-wheel',
  kbSupport: { // remove or set to null if not needed
    controlButtonWrappingLabels: '.slider-form label',
    wheelButtonWrappingLabels: '.slider-wheel-label',
  }
}

let slider = new Slider(settings);
slider.go(0, document.querySelector('.slider'));

let confButton = document.querySelector('.nav__item.configure');
confButton.addEventListener('keypress', (e) => {
  if (!confButton.classList.contains('pressed') && (e.keyCode == 13 || e.keyCode == 32)) {
    confButton.classList.add('pressed');
  }
});

let cp = document.querySelector('.control-panel');

confButton.addEventListener('click', () => {
  if (cp.classList.contains('off')) {
    getSliderMode(cp);
    getTransitDirection(cp);
    getAutoOptions(cp);
    getTimings();
    cp.classList.remove('off');
    setTimeout(activateControlPanel, 100);
  }
});

function getSliderMode(cp) {
  let mode = slider.settings.mode;
  let items = cp.querySelectorAll('.slider-mode');

  items.forEach(item => {
    let checker = item.querySelector('input');
    checker.checked = checkSelector(item, mode, 'data-mode', 'selected');
  });
}

function getTransitDirection(cp) {
  let mode = slider.settings.playDirection;
  let items = cp.querySelectorAll('.slider-direction');

  items.forEach(item => {
    let checker = item.querySelector('input');
    checker.checked = checkSelector(item, mode, 'data-dir', 'selected');
  });
}

function checkSelector(item, mode, itemAttr, switchClass) {
  if (item.getAttribute(itemAttr) == mode) {
    item.classList.add(switchClass);
    return true;
  } else {
    item.classList.remove(switchClass);
    return false;
  }
}

function getAutoOptions(cp) {
  let items = cp.querySelectorAll('.slider-autooption');

  items.forEach((item) => {
    let checker = item.querySelector('input');
    let data = slider.settings[item.getAttribute('data-opt')];
    checker.checked = checkBox(item, data);
  });
}

function checkBox(item, data) {
  if (data) {
    item.classList.add('checked');
  } else {
    item.classList.remove('checked');
  }

  return data;
}

function getTimings() {
  let fm = document.querySelector('.control__form');
  fm['swap-delay'].value = slider.settings.msSwapDelay;
  fm['swap-duration'].value = slider.settings.msSwapDuration;
}

cp.querySelectorAll('.slider-mode').forEach((item) => {
  item.addEventListener('click', () => {
    item.querySelector('input').checked = true;
    let mode = document.querySelector('.control__form').mode.value;
    cp.querySelectorAll('.slider-mode').forEach((item) => {
      checkSelector(item, mode, 'data-mode', 'selected');
    });
  });

  item.addEventListener('keydown', (e) => {
    if (e.keyCode == 32) {
      e.preventDefault();
      item.querySelector('input').checked = true;
      let mode = document.querySelector('.control__form').mode.value;
      cp.querySelectorAll('.slider-mode').forEach((item) => {
        checkSelector(item, mode, 'data-mode', 'selected');
      });
    }
  });
});

cp.querySelectorAll('.slider-direction').forEach((item) => {
  item.addEventListener('click', () => {
    item.querySelector('input').checked = true;
    let mode = document.querySelector('.control__form').direction.value;
    cp.querySelectorAll('.slider-direction').forEach((item) => {
      checkSelector(item, mode, 'data-dir', 'selected');
    });
  });

  item.addEventListener('keydown', (e) => {
    if (e.keyCode == 32) {
      e.preventDefault();
      item.querySelector('input').checked = true;
      let mode = document.querySelector('.control__form').direction.value;
      cp.querySelectorAll('.slider-direction').forEach((item) => {
        checkSelector(item, mode, 'data-dir', 'selected');
      });
    }
  });
});

cp.querySelectorAll('.slider-autooption').forEach((item) => {
  item.addEventListener('click', () => {
    let checker = item.querySelector('input');
    checker.checked = !checker.checked;
    checkBox(item, checker.checked);
  });

  item.addEventListener('keydown', (e) => {
    if (e.keyCode == 32) {
      e.preventDefault();
      let checker = item.querySelector('input');
      checker.checked = !checker.checked;
      checkBox(item, checker.checked);
    }
  });
});

let ctrlsPositionButtons = document.querySelectorAll('.placing-layout');

ctrlsPositionButtons.forEach((cpButton) => {
  cpButton.addEventListener('pointerdown', () => {
    cpButton.querySelector('input').checked = true;
  });

  cpButton.addEventListener('keydown', (e) => {
    if (e.keyCode == 32) {
      e.preventDefault();
      cpButton.querySelector('input').checked = true;
    }
  });
});

function activateControlPanel() {
  document.querySelector('.slider-mode').focus();
}

let confButtons = document.querySelectorAll('.configure-controls button');

confButtons.forEach(button => {
  button.addEventListener('click', () => {
    let fm = document.querySelector('.control__form');
    if (button.classList.contains('accept-button')) {
      settings.mode = fm.mode.value;
      settings.playDirection = fm.direction.value;
      settings.auto = fm.auto.checked;
      settings.loop = fm.loop.checked;

      if (!fm['swap-delay'].checkValidity()) {
        fm['swap-delay'].reportValidity()
        return;
      } else {
        settings.msSwapDelay = +fm['swap-delay'].value;
      }

      if (!fm['swap-duration'].checkValidity()) {
        fm['swap-duration'].reportValidity()
        return;
      } else {
        settings.msSwapDuration = +fm['swap-duration'].value;
      }

      fm['pl-default'].value = fm.placing.value;
      replaceSliderControlButtons(fm.placing.value);

      slider.destruct();
      slider = null;
      slider = new Slider(settings);
      slider.go(0, document.querySelector('.slider'));

    } else if (button.classList.contains('cancel-button')) {
      let cpDefault = fm['pl-default'].value;
      fm.querySelector(`.${cpDefault}`).checked = true;
    }

    cp.classList.add('off');
  });
});

function replaceSliderControlButtons(alignCode) {
  let sliderForm = document.querySelector('.slider-form');
  let decrWheelBtn = document.querySelector('.slider-wheel.decr');
  let incrWheelBtn = document.querySelector('.slider-wheel.incr');

  switch (alignCode) {
    case 'al-hrzcnt':
      sliderForm.className = 'slider-form al-hrzbtm';
      decrWheelBtn.className = 'slider-wheel decr al-hrzcnt';
      incrWheelBtn.className = 'slider-wheel incr al-hrzcnt';
      break;
    case 'al-hrztop':
      sliderForm.className = 'slider-form al-hrztop';
      decrWheelBtn.className = 'slider-wheel decr al-hrztop';
      incrWheelBtn.className = 'slider-wheel incr al-hrztop';
      break;
    case 'al-vrtrgt':
      sliderForm.className = 'slider-form al-vrtrgt';
      decrWheelBtn.className = 'slider-wheel decr al-vrtrgt';
      incrWheelBtn.className = 'slider-wheel incr al-vrtrgt';
      break;
    case 'al-vrtcnt':
      sliderForm.className = 'slider-form al-vrtrgt';
      decrWheelBtn.className = 'slider-wheel decr al-vrtcnt';
      incrWheelBtn.className = 'slider-wheel incr al-vrtcnt';
      break;
    case 'al-vrtlft':
      sliderForm.className = 'slider-form al-vrtlft';
      decrWheelBtn.className = 'slider-wheel decr al-vrtlft';
      incrWheelBtn.className = 'slider-wheel incr al-vrtlft';
      break;
    case 'al-hrzbtm':
    default:
      sliderForm.className = 'slider-form al-hrzbtm';
      decrWheelBtn.className = 'slider-wheel decr al-hrzbtm';
      incrWheelBtn.className = 'slider-wheel incr al-hrzbtm';
  }
}
