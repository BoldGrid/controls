export default {
	controlOptions: {
		control: {
			title: 'Box Shadow',
			name: 'box-shadow',
			linkable: {
				enabled: false
			},
			units: {
				default: 'px',
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
