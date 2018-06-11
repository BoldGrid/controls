export default {
	defaults: {
		control: {
			title: 'Universal',
			linkable: {
				enabled: true,
				isLinked: true
			},
			units: {
				default: 'percentage',
				enabled: [ 'px', 'percentage', 'em' ]
			},
			sliders: [
				{ name: 'top', label: 'Top', cssProperty: 'border-top-width' },
				{ name: 'right', label: 'Right', cssProperty: 'border-right-width' },
				{ name: 'bottom', label: 'Bottom', cssProperty: 'border-bottom-width' },
				{ name: 'left', label: 'Left', cssProperty: 'border-left-width' }
			]
		},
		responsive: {
			phone: 480,
			tablet: 780,
			desktop: 1080
		},
		slider: {
			px: {
				min: 0,
				max: 100
			},
			'%': {
				min: 0,
				max: 100
			},
			em: {
				min: 0.1,
				max: 5
			}
		}
	}
};
