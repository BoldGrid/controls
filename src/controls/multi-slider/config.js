let config = {
	defaults: {
		control: {
			title: 'Universal',
			linkable: {
				isLinked: true
			},
			units: {
				enabled: [ 'px', 'percentage', 'em' ]
			},
			sliders: [
				{ name: 'top', label: 'Top', cssProperty: 'border-top-width' },
				{ name: 'right', label: 'Right', cssProperty: 'border-right-width' },
				{ name: 'bottom', label: 'Bottom', cssProperty: 'border-bottom-width' },
				{ name: 'left', label: 'Left', cssProperty: 'border-left-width' }
			]
		},
		defaults: [
			{
				media: [ 'base', 'phone', 'tablet', 'desktop', 'large' ],
				unit: 'px',
				isLinked: false,
				values: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0
				}
			}
		],
		devicesEnabled: [ 'base', 'large', 'desktop', 'tablet', 'phone' ],
		defaultSelected: 'base',
		responsive: {

			// These are max widths.
			phone: 767, // 0 to 767 is phone.
			tablet: 991,  // 768 to 991 is tablet.
			desktop: 1199  // 992 to 1199 is desktop.

			// Large is 1200+
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

export { config as default };
