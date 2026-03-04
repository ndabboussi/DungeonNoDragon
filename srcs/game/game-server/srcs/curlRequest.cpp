#include "Server.hpp"

// static int debug_callback(CURL* handle, curl_infotype type, char* data, size_t size, void* userptr)
// {
// 	(void)handle;
// 	(void)userptr;
// 	switch (type) {
// 		case CURLINFO_HEADER_OUT:
// 			std::cout << "=== Requete ===" << std::endl;
// 			std::cout.write(data, size);
// 			std::cout << std::endl;
// 			break;

// 		case CURLINFO_DATA_OUT:
// 			std::cout << "=== Corps ===\n";
// 			std::cout.write(data, size);
// 			std::cout << std::endl;
// 			break;

// 		default:
// 			break;
// 	}
// 	return 0;
// }

static size_t write_callback(char* ptr, size_t size, size_t nmemb, void* userdata)
{
	size_t totalSize = size * nmemb;
	std::string* response = static_cast<std::string*>(userdata);
	response->append(ptr, totalSize);

	return (totalSize);
}

static void	generateToken(Server &server, CURL *curl, std::string &response, struct curl_slist *headers, CURLcode &result)
{
	std::string	body = R"({"clientId":"game-server-01", "clientSecret":"b723ea096f575e959637b81bdaadabaf22a39c98a73045c3f1e3bb96f10c3280"})";

	//fill the headers
	headers = curl_slist_append(headers, "Content-Type: application/json");

	//set the headers of the request
	curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

	//set the url for the request
	curl_easy_setopt(curl, CURLOPT_URL, "http://node-c:3000/auth/server");

	//define the POST method and put the body in the request
	curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());

	//define the fonction used to gather the response
	curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);

	//gather the response
	curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

	//same as the -v of curl, just write what's happening
	curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);

	//use for debugging
	// curl_easy_setopt(curl, CURLOPT_DEBUGFUNCTION, debug_callback);

	//perform the request
	result = curl_easy_perform(curl);
	if (result != CURLE_OK)
	{
		fprintf(stderr, "curl_easy_perform() failed : %s\n", curl_easy_strerror(result));
	}

	//free the headers
	curl_slist_free_all(headers);

	if (!response.empty())
	{
		if (response.find(R"("token":)") != response.npos)
		{
			// std::string token = response;
			server.setServerToken(response.substr(response.find(':') + 2, 185));
		}
	}
	else
		std::cout << "didnt get response" << std::endl;

	curl_easy_reset(curl);
}

static void	postViaCurl(CURL *curl, struct curl_slist *headers, CURLcode &result, std::string url, std::string const &token, std::string body)
{
	// "Authorization: Bearer mytoken123"
	headers = curl_slist_append(headers, "Content-Type: application/json");

	std::string bearer = "Authorization: Bearer " + token;

	headers = curl_slist_append(headers, bearer.c_str());

	curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

	curl_easy_setopt(curl, CURLOPT_URL, /*"http://node-c:3000/game/create"*/url.c_str());

	curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());

	curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);

	result = curl_easy_perform(curl);
	if (result != CURLE_OK)
		fprintf(stderr, "curl_easy_perform() failed : %s\n", curl_easy_strerror(result));

	curl_slist_free_all(headers);

	curl_easy_reset(curl);
}

void	sendViaCurl(Server &server, std::string url, std::string method, std::string body, int flag)
{
	(void)method, (void)body;
	std::string response;

	CURL		*curl;

	CURLcode	result = curl_global_init(CURL_GLOBAL_ALL);
	if (result != CURLE_OK)
		return ;

	curl = curl_easy_init();
	if (!curl)
		return ;

	struct curl_slist	*headers = NULL;

	if (server.getServerToken().empty() || flag)
		generateToken(server, curl, response, headers, result);

	if (method == "POST")
		postViaCurl(curl, headers, result, url, server.getServerToken(), body);

	curl_easy_cleanup(curl);
	curl_global_cleanup();

	std::cout << server.getServerToken() << std::endl;

	return ;
}