d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
	.then(dataset => {
		/*
		{
			baseTemperature: number,
			monthlyVariance: [
				{
					year: number (1753-2015),
					month: number (1-12),
					variance: -1.366
				}...
			]
		}
		*/
		console.log(dataset);
		const baseTemperature = dataset.baseTemperature;
		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		dataset = dataset.monthlyVariance;

		// CONFIGURATION
		const title = 'Global Land-Surface Temperature';
		const description = '1753-2015: base temperature 8.66\u00B0C'; // \u00B0 is the degree symbol
		const width = 1500;
		const height = 560;
		const padding = 60
		const palette = [
			'#1984c5',
			'#22a7f0',
			'#63bff0',
			'#a7d5ed',
			'#e2e2e2',
			'#e1a692',
			'#de6e56',
			'#e14b31',
			'#c23728'
		];

		// TITLE & DESCRIPTION
		d3.select('body')
			.append('h1')
			.attr('id', 'title')
			.style('margin', '0 0 0 50px')
			.text(title);

		d3.select('body')
			.append('h2')
			.attr('id', 'description')
			.style('margin', '0 0 0 50px')
			.text(description);
			
		// SVG
		const svg = d3.select('body')
			.append('svg')
			.attr('width', width)
			.attr('height', height);

		// AXES
		const xScale = d3.scaleLinear()
			.domain([
				d3.min(dataset, data => data.year),
				d3.max(dataset, data => data.year + 1)
			])
			.range([padding, width - padding])
		const xAxis = d3.axisBottom(xScale)
			.tickFormat(year => year.toString());
		svg.append('g')
			.attr('id', 'x-axis')
			.attr('transform', `translate(0, ${height - padding})`)
			.call(xAxis);

		const yScale = d3.scaleLinear()
			.domain([
				d3.max(dataset, data => data.month + 0.5),
				d3.min(dataset, data => data.month - 0.5)
			])
			.range([height - padding, padding]);
		const yAxis = d3.axisLeft(yScale)
			.tickFormat(month => {
				return months[month - 1];
			});
		svg.append('g')
			.attr('id', 'y-axis')
			.attr('transform', `translate(${padding}, 0)`)
			.call(yAxis);

		// CELLS
		svg.selectAll('rect')
			.data(dataset)
			.enter()
			.append('rect')
			.attr('class', 'cell')
			.attr('data-month', data => data.month - 1)
			.attr('data-year', data => data.year)
			.attr('data-temp', data => baseTemperature + data.variance)
			.attr('x', data => xScale(data.year))
			.attr('y', data => yScale(data.month - 0.5))
			.attr('width', width / 263)
			.attr('height', (height - padding * 2) / 12)
			.attr('fill', data => {
				if (data.variance < -1.75) {
					return palette[0];
				}
				if (data.variance >= -1.75 && data.variance < -1.25) {
					return palette[1];;
				}
				if (data.variance >= -1.25 && data.variance < -0.75) {
					return palette[2];
				}
				if (data.variance >= -0.75 && data.variance < -0.25) {
					return palette[3];
				}
				if (data.variance >= -0.25 && data.variance < 0.25) {
					return palette[4];
				}
				if (data.variance >= 0.25 && data.variance < 0.75) {
					return palette[5];
				}
				if (data.variance >= 0.75 && data.variance < 1.25) {
					return palette[6];
				}
				if (data.variance >= 1.25 && data.variance < 1.75) {
					return palette[7];
				}
				if (data.variance >= 1.75) {
					return palette[8];
				}
			})
			.on('mouseover', event => {
				event.target.style.stroke = 'black';
				event.target.style.strokeWidth = '2px'
				tooltip.html(`
					${months[event.target.dataset.month]}, ${event.target.dataset.year}<br>
					${parseFloat(event.target.dataset.temp).toFixed(1)}\u00B0C<br>
					${(parseFloat(event.target.dataset.temp) - baseTemperature).toFixed(1)}\u00B0C
				`)
					.attr('data-year', event.target.dataset.year)
					.style('left', event.target.getBoundingClientRect().x + window.scrollX + 'px')
					.style('top', event.target.getBoundingClientRect().y + window.scrollY - 100 + 'px')
					.style('opacity', 0.8);
			})
			.on('mouseout', event => {
				event.target.style.stroke = 'none';
				tooltip.style('opacity', 0);
			});

		// TOOLTIP
		const tooltip = d3.select('body')
			.append('div')
			.attr('id', 'tooltip')
			.style('position', 'absolute')
			.style('color', 'white')
			.style('border-radius', '5px')
			.style('padding', '10px')
			.style('background', 'black')
			.style('opacity', 0);

		// LEGEND
		const legend = d3.select('body')
			.append('svg')
			.attr('id', 'legend')
			.attr('width', width)
			.attr('height', 100);
		legend.selectAll('rect')
			.data(palette)
			.enter()
			.append('rect')
			.attr('x', (color, index) => width / 2 / 9 * (index + 1))
			.attr('y', 0)
			.attr('width', width / 2 / 9)
			.attr('height', 25)
			.attr('fill', color => color);
		legend.selectAll('text')
			.data([6.41, 6.91, 7.41, 7.91, 8.41, 8.91, 9.41, 9.91, 10.41, 10.91])
			.enter()
			.append('text')
			.attr('x', (temp, index) => width / 2 / 9 * (index + 1) - 15)
			.attr('y', 40)
			.text(temp => temp.toFixed(1) + '\u00B0C');
	});