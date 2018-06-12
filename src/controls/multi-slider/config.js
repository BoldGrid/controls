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

			// These are max widths.
			phone: 480, // 0 to 480 is phone.
			tablet: 992,  // 481 to 992 is tablet.
			desktop: 1200  // 993 to 1200 is desktop.
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
