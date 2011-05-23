package org.bitbucket.cursodeconducir;

import com.vaadin.Application;
import com.vaadin.event.MouseEvents;
import com.vaadin.event.MouseEvents.ClickEvent;
import com.vaadin.incubator.cufonlabel.CufonLink;
import com.vaadin.incubator.dashlayout.ui.HorDashLayout;
import com.vaadin.incubator.dashlayout.ui.VerDashLayout;
import com.vaadin.terminal.ExternalResource;
import com.vaadin.terminal.Sizeable;
import com.vaadin.terminal.ThemeResource;
import com.vaadin.ui.Alignment;
import com.vaadin.ui.Component;
import com.vaadin.ui.Embedded;
import com.vaadin.ui.HorizontalLayout;
import com.vaadin.ui.Window;
import com.vaadin.ui.Component.Event;

/**
 * The Application's "main" class
 */
@SuppressWarnings("serial")
public class CursoDeConducirApplication extends Application {
	private Window window;
	private HorizontalLayout menuPanel;
	private VerDashLayout invisibleRoot;
	private VerDashLayout topWrapper;
	private HorDashLayout top;
	private VerDashLayout contentWrapper;
	private HorDashLayout contentSpace;
	private VerDashLayout bottomSpace;

	@Override
	public void init() {
		window = new Window("Curso de Conducir");
		setMainWindow(window);

		setUpLayout();
		topMenu();

		setTheme("cursodeconducir");

	}

	private void setUpLayout() {
		invisibleRoot = new VerDashLayout();
		invisibleRoot.setSizeFull();
		invisibleRoot.setSpacing(false);
		invisibleRoot.setMargin(false);
		window.setContent(invisibleRoot);

		top();
		content();
		bottom();
	}

	private void top() {
		topWrapper = new VerDashLayout();
		invisibleRoot.addComponent(topWrapper);
		invisibleRoot.setComponentAlignment(topWrapper, Alignment.TOP_CENTER);
		invisibleRoot.setExpandRatio(topWrapper, 0);

		topWrapper.setStyleName("topWrapper");
		topWrapper.setHeight("90px");

		topWrapper.setMargin(false);
		topWrapper.setSpacing(false);

		top = new HorDashLayout();
		top.setWidth(960, Sizeable.UNITS_PIXELS);
		top.setHeight(75, Sizeable.UNITS_PIXELS);
		top.setSpacing(false);
		top.setMargin(false);
		top.setStyleName("top");

		topWrapper.addComponent(top);
		topWrapper.setComponentAlignment(top, Alignment.TOP_CENTER);

		logo();
		topSpace();
	}

	private void logo() {
		Embedded em = new Embedded("", new ThemeResource("logo_80x80.png"));
		em.setStyleName("logoPanel");
		em.setHeight(100, Sizeable.UNITS_PERCENTAGE);
		em.setWidth(80, Sizeable.UNITS_PIXELS);
		em.setMimeType("image/jpg");
		em.addListener(new MouseEvents.ClickListener() {
			
			@Override
			public void click(ClickEvent event) {
				window.showNotification("logo clicked");
			}
		});

		top.addComponent(em);
		top.setExpandRatio(em, 1);
	}

	private void topMenu(VerDashLayout topSpace) {
		menuPanel = new HorizontalLayout();
		topSpace.addComponent(menuPanel);
		topSpace.setComponentAlignment(menuPanel, Alignment.BOTTOM_RIGHT);
		menuPanel.setSizeFull();
	}

	private void topSpace() {
		VerDashLayout topSpace = new VerDashLayout();
		top.addComponent(topSpace);
		top.setExpandRatio(topSpace, 100);
		top.setComponentAlignment(topSpace, Alignment.MIDDLE_CENTER);
		topSpace.setSizeFull();
		topSpace.setMargin(false);
		topSpace.setSpacing(false);

		topMenu(topSpace);
	}

	private void topMenu() {
		HorizontalLayout menu = new HorizontalLayout();
		menu.setSpacing(true);
		menu.setSizeUndefined();
		menuPanel.addComponent(menu);
		menuPanel.setComponentAlignment(menu, Alignment.BOTTOM_LEFT);

		menu.addComponent(new CufonLink("Inicio", "HelveticaLight",
				new ExternalResource("http://test")));
		menu.addComponent(new CufonLink("Cursos Gratiutos  ", "HelveticaLight",
				new ExternalResource("http://test")));
		menu.addComponent(new CufonLink("Examne de trafico", "HelveticaLight",
				new ExternalResource("http://test")));
		menu.addComponent(new CufonLink("Tu nota de Examen   ",
				"HelveticaLight", new ExternalResource("http://test")));
	}

	private void content() {
		contentWrapper = new VerDashLayout();
		contentWrapper.setStyleName("contentWrapper");
		contentWrapper.setSizeUndefined();
		contentWrapper.setWidth(100,Sizeable.UNITS_PERCENTAGE);
		contentWrapper.setMargin(false);
		contentWrapper.setSpacing(false);

		invisibleRoot.addComponent(contentWrapper);
		invisibleRoot.setComponentAlignment(contentWrapper,
				Alignment.MIDDLE_CENTER);
		invisibleRoot.setExpandRatio(contentWrapper, 10);

		contentSpace = new HorDashLayout();
		contentSpace.setSizeFull();
		contentSpace.setWidth(960, Sizeable.UNITS_PIXELS);
		contentSpace.setSpacing(false);
		contentSpace.setMargin(false);
		contentSpace.setStyleName("content");
		
		HomePage homePage = new HomePage();
		homePage.setSizeFull();
		contentSpace.addComponent(homePage);

		contentWrapper.addComponent(contentSpace);
		contentWrapper
				.setComponentAlignment(contentSpace, Alignment.TOP_CENTER);
	}

	private void bottom() {
		bottomSpace = new VerDashLayout();
		bottomSpace.setStyleName("bottomSpace");
		bottomSpace.setSizeFull();
		bottomSpace.setHeight(200, Sizeable.UNITS_PIXELS);
		bottomSpace.setMargin(false);
		bottomSpace.setSpacing(false);

		invisibleRoot.addComponent(bottomSpace);
		invisibleRoot.setComponentAlignment(bottomSpace,
				Alignment.MIDDLE_CENTER);
		invisibleRoot.setExpandRatio(contentWrapper, 1);

	}
}
