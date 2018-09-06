export default {
	controlOptions: {
		control: {
			title: 'Box Shadow',
			name: 'box-shadow',
			linkable: {
				enabled: false
			},
			units: {
				enabled: [ 'px' ]
			},
			sliders: [
				{
					name: 'horizontal-position',
					label: 'Horizontal Position'
				},
				{
					name: 'vertical-position',
					label: 'Vertical Position'
				},
				{ name: 'blur-radius', label: 'Blur Radius' },
				{ name: 'spread-radius', label: 'Spread Radius' }
			]
		},

		// Default settings for the control.
		defaults: [
			{
				media: [ 'base', 'phone', 'tablet', 'desktop', 'large' ],
				unit: 'px',
				isLinked: false,
				type: '',
				color: '#cecece',
				values: {
					'horizontal-position': 0,
					'vertical-position': 0,
					'blur-radius': 0,
					'spread-radius': 0
				}
			}
		]
	},

	sliderConfig: {
		'horizontal-position': {
			min: -50,
			max: 50
		},
		'vertical-position': {
			min: -50,
			max: 50
		},
		'blur-radius': {
			min: 0,
			max: 100
		},
		'spread-radius': {
			min: -25,
			max: 25
		}
	}
};
