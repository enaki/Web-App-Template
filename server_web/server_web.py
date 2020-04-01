import socket
import re
import threading
lock = threading.Lock()
cerere_number_global = 1
def get_content_type(extension):
	if extension == 'html':
		return "text/html"
	elif extension == 'css':
		return "text/css"
	elif extension == 'js':
		return "application/js"
	elif extension == 'png':
		return "text/png"
	elif extension == 'jpg' or extension == 'jpeg':
		return "text/jpeg"
	elif extension == 'gif':
		return "text/gif"
	elif extension == 'ico':
		return "image/x-icon"
	elif extension == 'xml':
		return "application/xml"
	elif extension == 'json':
		return 'application/json'


def http_builder(data, filename=None):
	html_response = "HTTP/1.1 200 OK\r\n"
	html_response += "Content-Length: "+str(len(data))+"\r\n"
	if filename:
		html_response += "Content-Type: {}\r\n".format(get_content_type(filename.split('.')[-1]))
	else:
		html_response += "Content-Type: text/html\r\n"
	#html_response += "Content-Encoding: gzip\r\n"
	html_response += "Server: server_web.py\r\n\r\n"
	return html_response


def treat_client(clientsocket, address):

	global cerere_number_global, lock
	cerere_number = cerere_number_global
	lock.acquire()
	cerere_number_global += 1
	lock.release()
	
	print('S-a conectat un client. [Index cerere = {}][Start Thread]'.format(cerere_number))
	# se proceseaza cererea si se citeste prima linie de text
	cerere = ''
	linieDeStart = ''
	while True:
		data = clientsocket.recv(1024)
		cerere = cerere + data.decode()
		print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
		pozitie = cerere.find('\r\n')
		if (pozitie > -1):
			linieDeStart = cerere[0:pozitie]
			print('S-a citit linia de start din cerere: ##### ' + linieDeStart + ' #####')
			filename = "../continut" + linieDeStart.split()[1]
			try:
				file = open(filename, "rb")
				data = file.read()
				html_response = http_builder(data, filename=filename)
				#html_response += data
				clientsocket.sendall(html_response.encode(encoding = 'UTF-8') + data)

				break
			except FileNotFoundError: 
				data="Pagina {} ceruta nu exista".format(linieDeStart.split()[1])
				html_response = http_builder(data) + data
				clientsocket.sendall(html_response.encode(encoding = 'UTF-8'))
				break
		else:
			break
			
	print('S-a terminat citirea.')
	# TODO interpretarea sirului de caractere `linieDeStart` pentru a extrage numele resursei cerute
	# TODO trimiterea răspunsului HTTP
	clientsocket.close()
	print('S-a terminat comunicarea cu clientul cu cererea {}.[Stop Thread]'.format(cerere_number))


def main():
	# creeaza un server socket
	serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

	serversocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
	# specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
	serversocket.bind(('', 5678))
	# serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
	serversocket.listen(5)
	threads=[]

	while True:
		print('#########################################################################')
		print('Serverul asculta potentiali clienti.')
		# asteapta conectarea unui client la server
		# metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
		(clientsocket, address) = serversocket.accept()
		t = threading.Thread(target=treat_client, args=(clientsocket, address))
		t.start()
		threads.append(t)
	
	for thread in threads:
		thread.join()
		


if __name__ == '__main__':
	main()