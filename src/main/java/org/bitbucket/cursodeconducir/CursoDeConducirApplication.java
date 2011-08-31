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
import com.vaadin.ui.Link;
import com.vaadin.ui.Window;
import com.vaadin.ui.Component.Event;

/**
 * The Application's "main" class
 */
@SuppressWarnings("serial")
public class CursoDeConducirApplication extends Application {
	private static final String CONTENT_WRAPPER_STYLE_NAME = "contentWrapper";
	private static final String MENU_STYLE_NAME = "menu";
	private static final int TOP_WRAPPER_HEIGHT = 95;
	private static final int CONTENT_WIDTH = 960;
	private static final int TOP_HEIGHT = 75;
	private static final int TOP_WIDTH = CONTENT_WIDTH;

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
		topWrapper.setHeight(TOP_WRAPPER_HEIGHT, Sizeable.UNITS_PIXELS);

		topWrapper.setMargin(false);
		topWrapper.setSpacing(false);

		top = new HorDashLayout();
		top.setWidth(TOP_WIDTH, Sizeable.UNITS_PIXELS);
		top.setHeight(TOP_HEIGHT, Sizeable.UNITS_PIXELS);
		top.setSpacing(false);
		top.setMargin(false);
		top.setStyleName("top");

		topWrapper.addComponent(top);
		topWrapper.setComponentAlignment(top, Alignment.TOP_CENTER);

		logo();
		topSpace();
	}

	private void logo() {
		Embedded em = new Embedded("", new ThemeResource("logo_71x90.png"));
		em.setStyleName("logoPanel");
		em.setHeight(TOP_WRAPPER_HEIGHT - 5, Sizeable.UNITS_PIXELS);
		em.setWidth(71, Sizeable.UNITS_PIXELS);
		em.setMimeType("image/jpg");
		em.addListener(new MouseEvents.ClickListener() {

			@Override
			public void click(ClickEvent event) {
				window.showNotification("logo clicked");
			}
		});

		top.addComponent(em);
		top.setComponentAlignment(em, Alignment.TOP_RIGHT);
		top.setExpandRatio(em, 3);
	}

	private void topMenu(VerDashLayout topSpace) {
		menuPanel = new HorizontalLayout();
		topSpace.addComponent(menuPanel);
		topSpace.setComponentAlignment(menuPanel, Alignment.BOTTOM_CENTER);
		menuPanel.setSizeFull();
		menuPanel.setWidth(660, Sizeable.UNITS_PIXELS);
	}

	private void topSpace() {
		VerDashLayout topSpace = new VerDashLayout();
		top.addComponent(topSpace);
		top.setExpandRatio(topSpace, 30);
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
		menu.setStyleName(MENU_STYLE_NAME);

		menuPanel.addComponent(menu);
		menuPanel.setComponentAlignment(menu, Alignment.BOTTOM_LEFT);

		menu.addComponent(link("Inicio", "http:/test"));
		menu.addComponent(link("Cursos Gratiutos", "http://test"));
		menu.addComponent(link("Examne de trafico", "http://test"));
		menu.addComponent(link("Tu nota de Examen", "http://test"));
	}

	private Link link(String caption, String url) {
		Link link = new Link(caption, new ExternalResource(url));
		link.setStyleName(MENU_STYLE_NAME);
		return link;
	}

	private void content() {
		contentWrapper = new VerDashLayout();
		contentWrapper.setStyleName(CONTENT_WRAPPER_STYLE_NAME);
		contentWrapper.setSizeUndefined();
		contentWrapper.setWidth(100, Sizeable.UNITS_PERCENTAGE);
		contentWrapper.setMargin(false);
		contentWrapper.setSpacing(false);

		invisibleRoot.addComponent(contentWrapper);
		invisibleRoot.setComponentAlignment(contentWrapper,
				Alignment.MIDDLE_CENTER);
		invisibleRoot.setExpandRatio(contentWrapper, 10);

		contentSpace = new HorDashLayout();
		contentSpace.setSizeFull();
		contentSpace.setWidth(CONTENT_WIDTH, Sizeable.UNITS_PIXELS);
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
