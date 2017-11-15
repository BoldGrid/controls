export default {
	controlOptions: {
		control: {
			title: 'Box Shadow',
			name: 'box-shadow',
			linkable: false,
			units: {
				default: 'px',
				enabled: [ 'px' ]
			},
			sliders: [
				{
					name: 'horizontal-position',
					label: 'Horizontal Position',
					cssProperty: 'border-top-left-radius'
				},
				{
					name: 'vertical-position',
					label: 'Vertical Position',
					cssProperty: 'border-top-right-radius'
				},
				{ name: 'blur-radius', label: 'Blur Radius', cssProperty: 'border-bottom-right-radius' },
				{ name: 'spread-radius', label: 'Spread Radius', cssProperty: 'border-bottom-right-radius' }
			]
		},
		slider: {
			px: {
				min: -200,
				max: 200
			},
			em: {
				min: 0.1,
				max: 5
			}
		}
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
