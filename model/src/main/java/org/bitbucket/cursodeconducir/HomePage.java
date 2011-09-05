package org.bitbucket.cursodeconducir;

import com.vaadin.incubator.cufonlabel.CufonLink;
import com.vaadin.terminal.ExternalResource;
import com.vaadin.ui.GridLayout;
import com.vaadin.ui.HorizontalLayout;
import com.vaadin.ui.Label;
import com.vaadin.ui.Panel;
import com.vaadin.ui.VerticalLayout;

public class HomePage extends HorizontalLayout {
	private static final long serialVersionUID = -4507813120311932198L;

	private GridLayout contentArea;
	private VerticalLayout sideMenu;

	public HomePage() {
		setMargin(true);
		setSpacing(true);
		sideMenu = new VerticalLayout();
		sideMenu.setSizeUndefined();
		addComponent(sideMenu);
		setExpandRatio(sideMenu, 1);

		sideMenu.addComponent(new CufonLink("Inicio", "HelveticaLight",
				new ExternalResource("http://test")));
		sideMenu.addComponent(new CufonLink("Cursos Gratiutos  ",
				"HelveticaLight", new ExternalResource("http://test")));
		sideMenu.addComponent(new CufonLink("Examne de trafico",
				"HelveticaLight", new ExternalResource("http://test")));
		sideMenu.addComponent(new CufonLink("Tu nota de Examen   ",
				"HelveticaLight", new ExternalResource("http://test")));

		contentArea = new GridLayout(2, 5);
		contentArea.setSizeFull();
		contentArea.setStyleName("m-p-contentArea");
		contentArea.setMargin(true);
		contentArea.setSpacing(true);

		addComponent(contentArea);
		setExpandRatio(contentArea, 30);
		
		for (int i = 0; i < 10 ; i++) {
			createLabel("Exemplo " + i);
		}
	}

	private Label createLabel(String caption) {
		Panel panel = new Panel(caption);
		panel.setSizeFull();
		contentArea.addComponent(panel);
		Label l = new Label(
				"Últimas novedades de 2010\n"
						+ "Consulta o descarga las Novedades de Sanciones:\n"
						+ "\n"
						+ " Resumen con las Novedades de Sanciones y Procedimiento.\n"
						+ "\n"
						+ "Novedades del 2009\n"
						+ "Consulta o descarga el nuevo sistema sancionador:\n"
						+ "\n"
						+ " Legislación Nuevo Sistema Sancionador.\n"
						+ "\n"
						+ "Consulta o descarga la nueva legislación:\n"
						+ "\n"
						+ " Legislación Reglamento General de Conductores. \n"
						+ "\n"
						+ "Novedades de 2007\n"
						+ "Obtén el permiso de conducir por un euro al día. Visita   esta web de la DGT para conocer las condiciones y requisitos.\n"
						+ "\n"
						+ "Novedades de 2006\n"
						+ "Todo lo que necesitas saber sobre el  Permiso Por Puntos\n"
						+ "\n"
						+ " Legislación completa sobre el Permiso Por Puntos.\n"
						+ "\n"
						+ "Novedades de 2004\n"
						+ "Esté siempre al día, reciba nuestras noticias con el nuevo canal de noticias que hemos preparado.\n"
						+ "\n" + "Novedades de 2003\n"
						+ " Folleto de la D.G.T.\n" + "\n"
						+ " El Gobierno Informa: Normas\n" + "\n"
						+ "Novedades de 2001\n" + " Novedades Ley 19/2001\n"
						+ "\n" + "Legislación\n"
						+ " Reglamento General de Circulación\n" + "\n"
						+ " Normativa Reguladora\n" + "\n"
						+ " Consejos D.G.T.\n" + "\n" + "Búsqueda en internet");
		l.setSizeFull();
		panel.addComponent(l);
		return l;
	}
}
