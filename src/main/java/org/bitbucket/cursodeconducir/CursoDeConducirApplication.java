package org.bitbucket.cursodeconducir;

import org.vaadin.addon.borderlayout.BorderLayout;

import com.vaadin.Application;
import com.vaadin.incubator.dashlayout.ui.VerDashLayout;
import com.vaadin.ui.Button;
import com.vaadin.ui.Button.ClickEvent;
import com.vaadin.ui.Label;
import com.vaadin.ui.Window;

/**
 * The Application's "main" class
 */
@SuppressWarnings("serial")
public class CursoDeConducirApplication extends Application {
	private Window window;

	@Override
	public void init() {
		window = new Window("My Vaadin Application sdf sdf");
		setMainWindow(window);
		
		
		VerDashLayout root = new VerDashLayout();
		
		root.addComponent(new Button("test"));
		root.setSizeFull();
		root.setMargin(true);
		root.setSpacing(true);
		root.setStyleName("root");
		window.setContent(root);
		
		setTheme("cursodeconducir");

	}

}
