
// Initial state
let initial = {
  sections: ['inicio', 'websamigas', 'conferencias',
    'paraleer', 'mislibros', 'premios', 'biografia',
    'encuentros', 'matematicas', 'contacto', 'elsahara'],
  currentSection: 'inicio'
}

// Reducer
export default function reducer (state = initial, action) {
  console.log('Action', action)
  switch (action.type) {
    case 'showSection':
      return { sections: state.sections, currentSection: action.section }
    default:
      return state
  }
}
