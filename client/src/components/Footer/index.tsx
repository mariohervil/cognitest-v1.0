const Footer = () => {
	const date = new Date();
	const year = date.getFullYear();
	return (
		<footer className="bg-gray-900 py-6 text-center">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="md:col-span-1">
						<h4 className="text-primary text-lg font-semibold">
							Hospital de Neurorehabilitació
						</h4>
						<ul className="mt-4 space-y-2">
							<li>
								<a
									href="https://goo.gl/maps/7U7wKHg74QZiEMwa6"
									className="text-gray-400 hover:text-white"
								>
									Camí de Can Ruti, s/n 08916 Badalona
								</a>
							</li>
							<li>
								<a
									href="mailto:admissions@guttmann.com"
									className="text-gray-400 hover:text-white"
								>
									admissions@guttmann.com
								</a>
							</li>
							<li>
								<a
									href="tel:+34 934 977 700"
									className="text-gray-400 hover:text-white"
								>
									+34 934 977 700
								</a>
							</li>
						</ul>
					</div>
					<div className="md:col-span-1">
						<h4 className="text-primary text-lg font-semibold">Guttmann Barcelona</h4>
						<ul className="mt-4 space-y-2">
							<li>
								<a
									href="https://goo.gl/maps/vVkQyVWqmytJQVf17"
									className="text-gray-400 hover:text-white"
								>
									Garcilaso, 57 08027 Barcelona
								</a>
							</li>
							<li>
								<a
									href="mailto:barcelona@guttmann.com"
									className="text-gray-400 hover:text-white"
								>
									barcelona@guttmann.com
								</a>
							</li>
							<li>
								<a
									href="tel:+34 933 512 211"
									className="text-gray-400 hover:text-white"
								>
									+34 933 512 211
								</a>
							</li>
						</ul>
					</div>
				</div>
				<hr className="my-6 border-gray-800" />
				<p className="text-center text-gray-400">
					© {year} <span className="font-bold">Mario Hernández Villada</span> y{' '}
					<span className="font-bold">Eros Ruiz Ramirez</span>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
