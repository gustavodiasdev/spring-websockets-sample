package bk.tailfile.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class RootController {
	@RequestMapping("/")
	public String onRootAccess() {
		return "helloworld/home";
	}
}
