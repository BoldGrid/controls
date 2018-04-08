export default {
	controlOptions: {
		control: {
			title: 'Text Shadow',
			collapsible: {
				hidden: false
			},
			name: 'text-shadow',
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
				{ name: 'blur-radius', label: 'Blur Radius', cssProperty: 'border-bottom-right-radius' }
			]
		},
		slider: {
			px: {
				min: -200,
				max: 200
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
		}
	}
};
