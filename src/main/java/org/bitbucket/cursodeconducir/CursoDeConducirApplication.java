package org.bitbucket.cursodeconducir;

import org.vaadin.addon.borderlayout.BorderLayout;

import com.vaadin.Application;
import com.vaadin.incubator.dashlayout.ui.HorDashLayout;
import com.vaadin.incubator.dashlayout.ui.VerDashLayout;
import com.vaadin.terminal.ExternalResource;
import com.vaadin.terminal.Sizeable;
import com.vaadin.ui.AbsoluteLayout;
import com.vaadin.ui.Alignment;
import com.vaadin.ui.Button;
import com.vaadin.ui.Button.ClickEvent;
import com.vaadin.ui.CssLayout;
import com.vaadin.ui.HorizontalLayout;
import com.vaadin.ui.Label;
import com.vaadin.ui.Link;
import com.vaadin.ui.Panel;
import com.vaadin.ui.TabSheet;
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
		invisibleRoot.setSizeFull();
		invisibleRoot.setMargin(false);
		window.setContent(invisibleRoot);

		VerDashLayout topWrapper = new VerDashLayout();
		invisibleRoot.addComponent(topWrapper);

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
		topSpace.addComponent(new Label("Top Space"));

		menuPanel = new HorizontalLayout();
		topSpace.addComponent(menuPanel);
		topSpace.setComponentAlignment(menuPanel, Alignment.BOTTOM_RIGHT);
		menuPanel.setSizeFull();
		// menuPanel.setSpacing(false);
		// menuPanel.setMargin(false);
//		menuPanel.setStyleName("logo");
		
		AbsoluteLayout content = new AbsoluteLayout();
		content.setSizeUndefined();
		content.setWidth(960, Sizeable.UNITS_PIXELS);
		content.setMargin(false);
		content.setStyleName("top");
		content.addComponent(new Label("Conent"));

		topWrapper.addComponent(content);
		topWrapper.setComponentAlignment(content, Alignment.BOTTOM_CENTER);
		
	}

	private void setUpTopMenu() {
		
		CssLayout menu = new CssLayout();
		menu.setSizeFull();
		menu.setStyleName("logo");
		menuPanel.addComponent(menu);
		menuPanel.setComponentAlignment(menu, Alignment.BOTTOM_CENTER);
		
		menu.addComponent(new Link("Inicio", new ExternalResource("http://test")));
		menu.addComponent(new Link("Cursos Gratiutos Online", new ExternalResource("http://test")));
		menu.addComponent(new Link("Examne de trafico", new ExternalResource("http://test")));
		menu.addComponent(new Link("Tu nota de Examen", new ExternalResource("http://test")));
	}
}
