package org.bitbucket.cursodeconducir;

import com.vaadin.Application;
import com.vaadin.incubator.cufonlabel.CufonLink;
import com.vaadin.incubator.dashlayout.ui.HorDashLayout;
import com.vaadin.incubator.dashlayout.ui.VerDashLayout;
import com.vaadin.terminal.ExternalResource;
import com.vaadin.terminal.Sizeable;
import com.vaadin.ui.AbsoluteLayout;
import com.vaadin.ui.Alignment;
import com.vaadin.ui.HorizontalLayout;
import com.vaadin.ui.Label;
import com.vaadin.ui.Panel;
import com.vaadin.ui.VerticalLayout;
import com.vaadin.ui.Window;

/**
 * The Application's "main" class
 */
@SuppressWarnings("serial")
public class CursoDeConducirApplication extends Application {
	private Window window;
	private HorizontalLayout menuPanel;
	private Panel logoPanel;

	@Override
	public void init() {
		window = new Window("Curso de Conducir");
		setMainWindow(window);

		setUpLayout();
		setUpTopMenu();

		setTheme("cursodeconducir");

	}

	private void setUpLayout() {
		VerDashLayout invisibleRoot = new VerDashLayout();
		invisibleRoot.setStyleName("logo");
		invisibleRoot.setSizeFull();
		invisibleRoot.setSpacing(false);
		invisibleRoot.setMargin(false);
		window.setContent(invisibleRoot);

		VerDashLayout topWrapper = new VerDashLayout();
		invisibleRoot.addComponent(topWrapper);
		invisibleRoot.setComponentAlignment(topWrapper, Alignment.TOP_CENTER);
		invisibleRoot.setExpandRatio(topWrapper, 0);

		topWrapper.setStyleName("topWrapper");
		topWrapper.setHeight("90px");

		topWrapper.setMargin(false);
		topWrapper.setSpacing(false);

		HorDashLayout top = new HorDashLayout();
		top.setWidth(960, Sizeable.UNITS_PIXELS);
		top.setHeight(75, Sizeable.UNITS_PIXELS);
		top.setSpacing(false);
		top.setMargin(false);
		top.setStyleName("top");

		topWrapper.addComponent(top);
		topWrapper.setComponentAlignment(top, Alignment.TOP_CENTER);

		logoPanel = new Panel();
		logoPanel.setSizeUndefined();
		logoPanel.addComponent(new Label("logo"));
		logoPanel.setStyleName("logo");
		logoPanel.setHeight(100, Sizeable.UNITS_PERCENTAGE);

		top.addComponent(logoPanel);
		top.setExpandRatio(logoPanel, 1);

		VerDashLayout topSpace = new VerDashLayout();
		top.addComponent(topSpace);
		top.setExpandRatio(topSpace, 100);
		top.setComponentAlignment(topSpace, Alignment.MIDDLE_CENTER);
		topSpace.setSizeFull();
		topSpace.setStyleName("logo");
		topSpace.setMargin(false);
		topSpace.setSpacing(false);

		menuPanel = new HorizontalLayout();
		topSpace.addComponent(menuPanel);
		topSpace.setComponentAlignment(menuPanel, Alignment.BOTTOM_RIGHT);
		menuPanel.setSizeFull();
		
		VerDashLayout contentWrapper = new VerDashLayout();
		contentWrapper.setStyleName("contentWrapper");
		contentWrapper.setSizeFull();
		contentWrapper.setMargin(false);
		contentWrapper.setSpacing(false);
	
		invisibleRoot.addComponent(contentWrapper);
		invisibleRoot.setComponentAlignment(contentWrapper, Alignment.MIDDLE_CENTER);
		invisibleRoot.setExpandRatio(contentWrapper, 10);
		
		HorDashLayout content = new HorDashLayout();
		content.setSizeFull();
		content.setWidth(960, Sizeable.UNITS_PIXELS);
		content.setSpacing(false);
		content.setMargin(false);
		content.setStyleName("content");
		
		contentWrapper.addComponent(content);
		contentWrapper.setComponentAlignment(content, Alignment.TOP_CENTER);
		
	}

	private void setUpTopMenu() {

		HorizontalLayout menu = new HorizontalLayout();
		menu.setSpacing(true);
		menu.setSizeUndefined();
		menu.setStyleName("logo");
		menuPanel.addComponent(menu);
		menuPanel.setComponentAlignment(menu, Alignment.BOTTOM_LEFT);

		menu.addComponent(new CufonLink("Inicio", "HelveticaRounded",
				new ExternalResource("http://test")));
		menu.addComponent(new CufonLink("Cursos Gratiutos Online",
				"HelveticaRounded", new ExternalResource("http://test")));
		menu.addComponent(new CufonLink("Examne de trafico",
				"HelveticaRounded", new ExternalResource("http://test")));
		menu.addComponent(new CufonLink("Tu nota de Examen",
				"HelveticaRounded", new ExternalResource("http://test")));
	}
}
